/* eslint @typescript-eslint/await-thenable: off */

import expect from './matchers';
import debounce from '../src';

jest.useFakeTimers();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup<TArgs extends any[], TReturn extends any>(
  wait = 100,
): [(...args: TArgs) => TReturn, (...args: TArgs) => Promise<TReturn>] {
  const fn = jest.fn().mockResolvedValue('whatever');
  const wrapped = debounce(fn, wait);
  return [fn, wrapped];
}

describe('debounce', () => {
  test('Single call', async () => {
    const [fn, wrapped] = setup();
    const promise = wrapped();
    jest.runAllTimers();
    await expect(promise).toResolve();
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('Multiple calls', async () => {
    const [fn, wrapped] = setup();
    const promise1 = wrapped(1);
    const promise2 = wrapped(2);
    jest.runAllTimers();

    await expect(promise1).toReject();
    await expect(promise2).toResolve();

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  test('Multiple calls with enough time passed', async () => {
    const [fn, wrapped] = setup();
    const promise1 = wrapped(1);
    const promise2 = wrapped(2);
    jest.runAllTimers();

    const promise3 = wrapped(3);
    const promise4 = wrapped(4);
    jest.runAllTimers();

    await expect(promise1).toReject();
    await expect(promise2).toResolve();
    await expect(promise3).toReject();
    await expect(promise4).toResolve();

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(2);
    expect(fn).toHaveBeenCalledWith(4);
  });
});
