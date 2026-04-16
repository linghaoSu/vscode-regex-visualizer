import type { OutputChannel } from 'vscode';
import { window } from 'vscode';
import { EXT_NAME } from './ext';

export class Log {
  private static _channel: OutputChannel;

  static get outputChannel(): OutputChannel {
    if (!this._channel) {
      this._channel = window.createOutputChannel(EXT_NAME);
    }
    return this._channel;
  }

  static raw(...values: any[]) {
    this.outputChannel.appendLine(values.map(i => i.toString()).join(' '));
  }

  static info(message: string | number, intend = 0) {
    this.outputChannel.appendLine(`${'\t'.repeat(intend)}${message}`);
  }

  static warn(message: string, prompt = false, intend = 0) {
    if (prompt) {
      window.showWarningMessage(message);
    }
    Log.info(`⚠ WARN: ${message}`, intend);
  }

  static async error(err: Error | string | any = {}, prompt = true, intend = 0) {
    if (typeof err !== 'string') {
      const messages = [
        err.message,
        err.response?.data,
        err.stack,
        err.toJSON?.(),
      ]
        .filter(Boolean)
        .join('\n');
      Log.info(`🐛 ERROR: ${err.name}: ${messages}`, intend);
    }

    if (prompt) {
      const openOutputButton = 'open output button';
      const message = typeof err === 'string'
        ? err
        : `${EXT_NAME} Error: ${err.toString()}`;

      const result = await window.showErrorMessage(message, openOutputButton);
      if (result === openOutputButton) {
        this.show();
      }
    }
  }

  static show() {
    this._channel.show();
  }

  static divider() {
    this.outputChannel.appendLine('\n――――――\n');
  }
}
