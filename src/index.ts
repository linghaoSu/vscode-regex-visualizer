import type { Uri } from 'vscode';
import { commands } from 'vscode';
import { disposeSettingListener, getSettings, initialSetting } from './settings';
import { Log } from './log';
import { getRelativePath } from './utils';
import { getCommandName } from './constant';

export function activate() {
  Log.info('extension activated! ');
  // start listening settings
  initialSetting();

  commands.registerCommand(getCommandName('some-example-command'), (fileUri?: Uri) => {
    if (fileUri) {
      const filePath = getRelativePath(fileUri.toString()) || '';

      Log.info(`[setting info]: ${JSON.stringify(getSettings(), null, 2)}`);

      Log.info(filePath);
    }
  });
}

// process exit;
export function deactivate() {
  disposeSettingListener();

  Log.info('i18n auto replace deactivate! ');
}
