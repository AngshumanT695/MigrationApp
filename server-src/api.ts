import * as express from 'express';
import { UpdateRequest } from './models/update-request';
import { InstallPackage } from './models/install-package';
import { ChangesFormat } from './models/change-list';
import checkNgProject from './utils/check-ng-project/check-ng-project';
import performDryRun from './utils/dry-run/perform-dry-run';
import getUpdateVersions from './utils/get-update-list/get-available-versions';
import getUpdateList from './utils/get-update-list/get-update-list';
import installNodePackage from './utils/utilities/install-node-package';
import unInstallNodePackage from './utils/utilities/un-install-node-package';
import sendChangesList from './utils/perform-changes/send-changes-list';
import checkGitStatus from './utils/utilities/checkGitStatus';
import performChanges from './utils/perform-changes/perform-changes';
import performUpdate from './utils/perform-update/perform-update';
import parseAppError from './utils/utilities/parse-app-error';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: 'App works fine.' });
});

router.post('/get-upgrade-list', (req, res) => {
  try {
    const projectPath: string = req.body?.path?.replace('\\', '/');
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

router.post('/changes-list', (req, res) => {
  try {
    const updateVersionFromTo = req.body as { from: string, to: string };
    const result = sendChangesList(updateVersionFromTo);
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

router.post('/uninstall-package', (req, res) => {
  try {
    const unInstallRequest = req.body as InstallPackage;
    const result = checkNgProject(unInstallRequest?.path) && unInstallNodePackage(unInstallRequest?.name, unInstallRequest.path);
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/check-git-status', (req, res) => {
  try {
    const result = checkGitStatus(req.body.path);
    res.json(result);
  } catch (ex) {
    res.status(500).json(parseAppError(ex));
  }
});

router.post('/perform-changes', (req, res) => {
  try {
    const changes = req.body as ChangesFormat;
    const filesChanged = performChanges(changes);
    res.json(filesChanged);
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
  res.status(404).json({message: 'Invalid API.'});
});

export default router;
