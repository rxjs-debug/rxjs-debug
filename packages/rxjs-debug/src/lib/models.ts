/**
 * Configuration Options for a RxJS-debugger instance.
 */
export interface DebuggerOptions {
  /**
   * Optional id for the RxJS-debugger instance.
   * If not provided, an automatic incremental `number` is used as the id.
   * e.g: First debugger without custom id will have `1` as id,
   * then second one will hve `2` as id, and so on.
   */
  id?: number | string;
  /**
   * An optional flag to turn off the logging of value after every operator.
   * This can be helpful if you just want to see how far does the stream go.
   */
  hideOutputs?: boolean;
  /**
   * To add a fixed delay before every operator, to slow down the execution of the stream.
   * Note: it uses `delay` operator to add the delay, hence it'll make the stream asynchronous.
   * Note: the delay is in `ms`.
   */
  addDelay?: number;
  /**
   * If set to `true`, the styling is disabled.
   * It can be useful if you're not using the browser console.
   * e.g.: when running unit tests in the terminal
   * Because only the browser understands the extra styling passed to console.log,
   * normal terminals will just print the raw styles.
   */
  noStyling?: boolean;
  /**
   * If set to `true`, logging will be disabled
   * e.g.: you might not want to log streams if you are in production environment
   */
  production?: boolean;  
}
