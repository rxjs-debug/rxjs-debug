import {COLORS_BY_OPERATOR, OPERATORS_BY_RETURNED_FN_BODY} from './meta';

let lastLogDebuggerId: string;
let lastLogOperatorExecCountMsg: string;

export class Logger {
  private readonly startMsg: string;
  private readonly endMsg: string;
  private readonly subscriptionMsg: string;
  private readonly completedMsg: string;
  private readonly erroredMsg: string;
  private readonly basePad: number;
  private readonly pad: number;

  readonly operatorNames: string[];
  private readonly longestNameLen: number;

  private readonly operatorsExecCountMap = {};
  private longestOperatorExecCountMsgLen = 0;
  private currentOperatorExecCountMsg: string;

  private subCount = 0;
  private subCountMsg: string;

  constructor(
    readonly debuggerId: string,
    operators: any[],
    private hideOutputs: boolean,
    private noStyling: boolean
  ) {
    this.startMsg = debuggerId + ' >> START';
    this.endMsg = debuggerId + ' >> END';
    this.subscriptionMsg = debuggerId + ' >> SUBSCRIBED';
    this.erroredMsg = debuggerId + ' >> ERRORED';
    this.completedMsg = debuggerId + ' >> COMPLETED';
    this.basePad = 7;
    this.pad =
      this.basePad +
      Math.max(
        this.startMsg.length,
        this.endMsg.length,
        this.subscriptionMsg.length,
        this.completedMsg.length
      );

    this.operatorNames = ['source'].concat(
      operators.map(op => OPERATORS_BY_RETURNED_FN_BODY[String(op)] || '')
    );
    this.longestNameLen = this.operatorNames.reduce((a, b) => (a.length > b.length ? a : b)).length;
  }

  logStart(): void {
    const msg = this.startMsg.padEnd(this.basePad + this.pad, '_');
    console.log((this.noStyling ? '' : '\n\n') + msg + this.subCountMsg.padStart(4, '_') + '__▽');
  }

  logResume(): void {
    if (
      (lastLogDebuggerId && lastLogDebuggerId !== this.debuggerId) ||
      (lastLogOperatorExecCountMsg &&
        lastLogOperatorExecCountMsg !== this.currentOperatorExecCountMsg)
    ) {
      const msg = this.debuggerId.padEnd(this.basePad + this.pad, '_');
      console.log((this.noStyling ? '' : '\n\n') + msg + this.subCountMsg.padStart(4, '_') + '___');
    }
  }

  logEnd(): void {
    const msg = this.endMsg.padEnd(this.basePad + this.pad, '‾');
    console.log(msg + this.subCountMsg.padStart(4, '‾') + '‾‾△' + (this.noStyling ? '' : '\n\n\n'));
  }

  logOperator(opIndex: number, value): void {
    const opName: string = this.operatorNames[opIndex];
    const opIndexStr = String(opIndex).padStart(2, ' ');
    const paddedIndexAndName = (opIndexStr + ' ' + opName).padEnd(this.longestNameLen + 4, ' ');
    const paddedExecCountMsg = `${this.currentOperatorExecCountMsg}`
      .padStart(this.longestOperatorExecCountMsgLen, ' ')
      .padEnd(this.longestOperatorExecCountMsgLen + 1, ' ');

    console.log(
      (this.noStyling ? '' : '%c') + paddedIndexAndName + paddedExecCountMsg,
      this.noStyling
        ? ''
        : `color: ${COLORS_BY_OPERATOR[opName]}; background-color: #000; padding: 3px; border-radius: 6px;`,
      this.hideOutputs === true ? '' : value
    );

    lastLogDebuggerId = this.debuggerId;
    lastLogOperatorExecCountMsg = this.currentOperatorExecCountMsg;
  }

  prepare(opIndex: number): void {
    const opName: string = this.operatorNames[opIndex];

    this.operatorsExecCountMap[opIndex + opName] =
      (this.operatorsExecCountMap[opIndex + opName] ?? 0) + 1;
    this.currentOperatorExecCountMsg =
      this.operatorsExecCountMap[opIndex + opName] > 1
        ? ` (${this.operatorsExecCountMap[opIndex + opName]})`
        : '';

    this.longestOperatorExecCountMsgLen = Math.max(
      this.longestOperatorExecCountMsgLen,
      this.currentOperatorExecCountMsg.length
    );
  }

  addSubscription(): void {
    this.subCount++;
    this.subCountMsg = this.subCount > 1 ? `S:${this.subCount}` : '';
    const msg = this.subscriptionMsg.padEnd(this.basePad + this.pad, '-');
    console.log(
      (this.noStyling ? '' : '\n') +
        msg +
        this.subCountMsg.padStart(4, '-') +
        '--▼' +
        (this.noStyling ? '' : '\n\n')
    );
  }

  logErrored(): void {
    const msg = this.erroredMsg.padEnd(this.basePad + this.pad, '-');
    console.log(
      (this.noStyling ? '' : '\n') +
        msg +
        this.subCountMsg.padStart(4, '-') +
        '--▲' +
        (this.noStyling ? '' : '\n\n')
    );
  }

  logCompleted(): void {
    const msg = this.completedMsg.padEnd(this.basePad + this.pad, '-');
    console.log(
      (this.noStyling ? '' : '\n') +
        msg +
        this.subCountMsg.padStart(4, '-') +
        '--▲' +
        (this.noStyling ? '' : '\n\n')
    );
  }
}
