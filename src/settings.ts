import { type Disposable, window, workspace } from 'vscode';
import { EXT_NAME } from './constant';

let disposeHandler: Disposable | undefined;

interface SettingInterfaceSample {
  sampleSettings?: string
}

type SettingType = SettingInterfaceSample;

const defaultSettings: SettingType = {
  sampleSettings: '',
};

const currentSettings: SettingType = {
  ...defaultSettings,
};

export const applyChange = (params: SettingType = {}) => {
  Object.assign(currentSettings, params);
};

export function initialSetting() {
  if (disposeHandler) {
    disposeSettingListener();
  }

  disposeHandler = workspace.onDidChangeConfiguration(async (e) => {
    const isChanged = await e.affectsConfiguration(EXT_NAME);

    if (isChanged) {
      window.showInformationMessage('changed!');
    }
  });
}

export function disposeSettingListener() {
  if (disposeHandler) {
    disposeHandler.dispose();
    disposeHandler = undefined;
  }
}

export function getSettings() {
  return currentSettings;
}
