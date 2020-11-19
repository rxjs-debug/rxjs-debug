import {Observable, of, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {$D} from '../lib/debugger';
import createSpy = jasmine.createSpy;

describe('RxJS Debugger', () => {
  let $: Observable<any>;
  let d$: Observable<any>;
  let consoleSpy: jasmine.Spy;

  beforeEach(() => {
    $ = of(1);
    d$ = $D($);
    consoleSpy = spyOn(console, 'log');
  });

  it('should return a new Observable with original as its source', () => {
    expect(d$).not.toBe($);
    expect(d$.source).toBe($);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should override and visualise the subscribe method', () => {
    const spy = createSpy();
    const subscription = d$.subscribe(spy);

    expect(subscription).toBeInstanceOf(Subscription);
    expect(spy).toHaveBeenCalledWith(1);

    expect(consoleSpy).toHaveBeenCalledTimes(5);

    const [
      [subscribedMsg],
      [startMsg],
      [sourceIndexAndName, sourceStyle, sourceValue],
      [endMsg],
      [completedMsg],
    ] = consoleSpy.calls.allArgs();

    consoleSpy.calls.allArgs().forEach(([firstArg]) => expect(firstArg).toContain('➰ '));

    expect(subscribedMsg).toContain('SUBSCRIBED');
    expect(startMsg).toContain('START');

    expect(sourceIndexAndName).toContain('%c 0 source');
    expect(sourceStyle).toContain('color: rgb');
    expect(sourceValue).toBe(1);

    expect(endMsg).toContain('END');
    expect(completedMsg).toContain('COMPLETED');
  });

  it('should override and visualise the pipe method', () => {
    const spy = createSpy();
    const subscription = d$.pipe(map(x => x + 10)).subscribe(spy);

    expect(subscription).toBeInstanceOf(Subscription);
    expect(spy).toHaveBeenCalledWith(11);

    expect(consoleSpy).toHaveBeenCalledTimes(6);

    const [
      [subscribedMsg],
      [startMsg],
      [sourceIndexAndName, sourceStyle, sourceValue],
      [mapIndexAndName, mapStyle, mapValue],
      [endMsg],
      [completedMsg],
    ] = consoleSpy.calls.allArgs();

    consoleSpy.calls.allArgs().forEach(([firstArg]) => expect(firstArg).toContain('➰ '));

    expect(subscribedMsg).toContain('SUBSCRIBED');
    expect(startMsg).toContain('START');

    expect(sourceIndexAndName).toContain('%c 0 source');
    expect(sourceStyle).toContain('color: rgb');
    expect(sourceValue).toBe(1);

    expect(mapIndexAndName).toContain('%c 1 map');
    expect(mapStyle).toContain('color: rgb');
    expect(mapValue).toBe(11);

    expect(endMsg).toContain('END');
    expect(completedMsg).toContain('COMPLETED');
  });

  it('should log ERRORED with error pass-through', () => {
    const spy = createSpy();
    const errorSpy = createSpy();
    const subscription = d$
      .pipe(
        map(x => x + 10),
        tap(() => {
          throw Error('22');
        })
      )
      .subscribe(spy, errorSpy);

    expect(subscription).toBeInstanceOf(Subscription);
    expect(spy).not.toHaveBeenCalled();
    expect(errorSpy.calls.allArgs()[0][0].message).toBe('22');
    expect(consoleSpy).toHaveBeenCalledTimes(5);

    const [
      [subscribedMsg],
      [startMsg],
      [sourceIndexAndName, sourceStyle, sourceValue],
      [mapIndexAndName, mapStyle, mapValue],
      [completedMsg],
    ] = consoleSpy.calls.allArgs();

    consoleSpy.calls.allArgs().forEach(([firstArg]) => expect(firstArg).toContain('➰ '));

    expect(subscribedMsg).toContain('SUBSCRIBED');
    expect(startMsg).toContain('START');

    expect(sourceIndexAndName).toContain('%c 0 source');
    expect(sourceStyle).toContain('color: rgb');
    expect(sourceValue).toBe(1);

    expect(mapIndexAndName).toContain('%c 1 map');
    expect(mapStyle).toContain('color: rgb');
    expect(mapValue).toBe(11);

    expect(completedMsg).toContain('ERRORED');
  });
});
