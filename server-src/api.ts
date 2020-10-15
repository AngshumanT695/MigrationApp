import * as express from 'express';
import { UpdateRequest } from './models/update-request';
import { InstallPackage } from './models/install-package';
import { ReplaceList } from './models/replace-list';
import checkNgProject from './utils/check-ng-project/check-ng-project';
import performDryRun from './utils/dry-run/perform-dry-run';
import getUpdateVersions from './utils/get-update-list/get-available-versions';
import getUpdateList from './utils/get-update-list/get-update-list';
import installNodePackage from './utils/utilities/install-node-package';
import replaceBeforeUpdate from './utils/replace-before-update/replace-before-update';
import performUpdate from './utils/performUpdate/perform-update';
import parseAppError from './utils/utilities/parse-app-error';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: 'App works fine.' });
});

router.post('/get-upgrade-list', (req, res) => {
  try {
    const projectPath: string = req.body.path;
    const result = checkNgProject(projectPath) && getUpdateVersions(getUpdateList(projectPath));
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/upgrade-dry', (req, res) => {
  try {
    const updateRequest = req.body as UpdateRequest;
    const result = checkNgProject(updateRequest?.path) && performDryRun(updateRequest);
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/install-package', (req, res) => {
  try {
    const installRequest = req.body as InstallPackage;
    const result = checkNgProject(installRequest?.path) && installNodePackage(installRequest?.name, installRequest?.path);
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/replace', (req, res) => {
  try {
    const replaceList = req.body as ReplaceList;
    const changedFiles = checkNgProject(replaceList?.path) && replaceBeforeUpdate(replaceList?.path, replaceList?.changes);
    res.json(changedFiles);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/upgrade', (req, res) => {
  try {
    const updateRequest = req.body as UpdateRequest;
    const result = checkNgProject(updateRequest?.path) && performUpdate(updateRequest);
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.all('*', (req, res) => {
  res.status(404).json({ message: 'Invalid API.' });
});

export default router;
