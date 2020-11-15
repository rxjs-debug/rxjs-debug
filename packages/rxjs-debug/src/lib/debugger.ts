import {Observable, Subscription, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Logger} from './logger';
import {DebuggerOptions} from './models';

let debuggersCount = 0;

/**
 * RxJS-debugger wrapper function, to enable automated logging for Observables and Streams.
 *
 * When an Observable is wrapped with this function,
 * it returns the same Observable after injecting the logging hooks into it.
 *
 * It overrides the `subscribe` and `pipe` methods and
 * replaces them with the custom trapped versions to achieve the expected monitoring and logging behavior.
 *
 * @example
 * ```ts
 * // raw Observable
 * const source$ = of(1, 2, 3)
 *
 * // wrapped Observable with automatic logging enabled
 * const sourceWithAutomaticLogging$ = $D(source$)
 *
 * // subscribe to start the logging
 * sourceWithAutomaticLogging$.subscribe()
 *
 * // you'll see the logging in the console
 *
 * // the target use-case would be when there are multiple operators applied
 * $D(source$).pipe(
 *   map(x => x + 5),
 *   switchMap(x => of(x * 2)),
 * )
 *
 * // you'll see even more detailed and useful logging in the console
 * ```
 *
 * @param $ The Observable that needs to be debugged.
 * @param options Configuration options for RxJS-debugger instance.
 */
export function $D<T>($: Observable<T>, options?: DebuggerOptions): Observable<T> {
  options = options || {};
  const debuggerId: string = String(options.id ?? ++debuggersCount);

  const ogSubscribe = $.subscribe;
  const ogPipe = $.pipe;
  let logger: Logger;

  $.pipe = function (...operators: any): Observable<T> {
    logger = new Logger(debuggerId, operators, options.hideOutputs);
    const injections = logger.operatorNames.length;

    for (let i = 0; i < injections; i++) {
      const tapper = tap(value => {
        logger.prepare(i);

        if (i === 0) {
          logger.logStart();
        } else {
          logger.logResume();
        }

        logger.logOperator(i, value);

        if (i === injections - 1) {
          logger.logEnd();
        }
      });

      operators.splice(i + i, 0, tapper);
    }
    operators.push(
      catchError(err => {
        logger.logErrored();
        return throwError(err);
      })
    );
    operators.push(tap({complete: () => logger.logCompleted()}));

    return ogPipe.apply(this, operators);
  };

  $.subscribe = function (...args): Subscription {
    if (!logger) {
      const tappedObservable = $.pipe();
      return tappedObservable.subscribe(...args);
    }

    logger.addSubscription();
    return ogSubscribe.apply(this, args);
  };

  return $;
}
