import { Window } from 'happy-dom';
export const EXT_NAME = 'extensionName';

export const mockWindow = new Window();
export const mockDocument = mockWindow.document;

export const getCommandName = (name: string) => `${EXT_NAME}.${name}`;
