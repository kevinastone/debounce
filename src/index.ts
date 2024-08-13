/* eslint @typescript-eslint/no-explicit-any: off */

export default <
  TArgs extends any[],
  TReturn extends any,
  TFunc extends (...args: TArgs) => Promise<TReturn>
>(
  func: TFunc,
  wait: number,
  error: any = undefined,
): ((...args: TArgs) => Promise<TReturn>) => {
  let latest: any;

  return (...args: TArgs) => {
    return new Promise<TReturn>((resolve, reject) => {
      latest = resolve;
      setTimeout(() => {
        if (latest === resolve) {
          func(...args).then(resolve);
        } else {
          reject(error);
        }
      }, wait);
    });
  };
};
