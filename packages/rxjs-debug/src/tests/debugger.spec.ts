import {Observable, of, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
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

  it('should return the same Observable instance', () => {
    expect(d$).toBe($);
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
});
