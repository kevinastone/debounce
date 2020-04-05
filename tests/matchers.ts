/* istanbul ignore file */
/* eslint @typescript-eslint/generic-type-naming: off, @typescript-eslint/explicit-function-return-type: off */
/* eslint @typescript-eslint/no-namespace: off */

declare global {
  namespace jest {
    interface Matchers<R> {
      toResolve(): R;
      toReject(): R;
    }
  }
}

expect.extend({
  async toResolve(received: Promise<unknown>) {
    return received.then(
      () => ({
        pass: true,
        message: () => 'Expected promise not to resolve',
      }),
      () => ({
        pass: false,
        message: () => 'Expected promise to resolve',
      }),
    );
  },

  async toReject(received: Promise<unknown>) {
    return received.then(
      () => ({
        pass: false,
        message: () => 'Expected promise to reject',
      }),
      () => ({
        pass: true,
        message: () => 'Expected promise not to reject',
      }),
    );
  },
});

export default expect;
