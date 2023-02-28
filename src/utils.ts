import { sep } from 'path';
import { Uri, workspace } from 'vscode';

interface WorkspaceInfo {
  name: string
  basePath: string
  uri?: Uri
  schemaPath: string
}

const info: WorkspaceInfo = {
  name: '',
  basePath: '',
  schemaPath: '',
};

export const emptyJSONContent = `{}
`;

export function getWorkspaceInfo() {
  const { workspaceFolders } = workspace;
  if (workspaceFolders?.length) {
    const [folder] = workspaceFolders;
    if (info.name !== folder.name) {
      info.name = folder.name;
      info.basePath = `${folder.uri.path}${sep}`;
      info.schemaPath = `${folder.uri.toString()}${sep}`;
      info.uri = folder.uri;
    }
  }
  else {
    return false;
  }
  return info;
}

export function isTargetFile(path: string) {
  // only check vue file for now
  if (/.*\.vue$/.test(path)) { return true; }
  return false;
}

export function getRelativePath(path: string) {
  const info = getWorkspaceInfo();
  if (!info) { return false; }

  if (path.startsWith(info.schemaPath)) { return path.slice((info.schemaPath).length); }

  return path;
}

export function getAbsoluteUri(path: string[]) {
  const info = getWorkspaceInfo();
  if (!info || !info.uri) { return false; }

  return Uri.joinPath(info.uri, ...path);
}
