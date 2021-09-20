declare module "*.worker.ts" {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends SharedWorker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
