import * as express from 'express';
import { UpdateRequest } from './models/update-request';
import checkNgProject from './utils/check-ng-project/check-ng-project';
import getUpdateVersions from './utils/get-update-list/get-available-versions';
import getUpdateList from './utils/get-update-list/get-update-list';

const router = express.Router();

router.get('/', function (req, res) {
  res.json({ data: 'App works fine.' });
})

router.post('/get-upgrade-list', function (req, res) {
  try {
    const projectPath: string = req.body.path;
    const result = checkNgProject(projectPath) && getUpdateVersions(getUpdateList(projectPath));
    res.json(result);
  } catch (ex) {
    res.status(500).json({ message: ex.message });
  }
})

router.post('/upgrade-dry', function (req, res) {
  try {
    const updateRequest = req.body as UpdateRequest;
    // TODO: Perform dry upgrade
  } catch (ex) {
    res.status(500).json({ message: ex.message });
  }
})

router.post('/upgrade', function (req, res) {
  try {
    const updateRequest = req.body as UpdateRequest;
    // TODO: Perform actual upgrade
  } catch (ex) {
    res.status(500).json({ message: ex.message });
  }
})

router.all('*', function (req, res) {
  res.status(404).json({ message: 'Invalid API.' });
})

export default router;
