import express from 'express';
import Project from './project.model.js';
import * as projectController from './project.controllers.js';
// import { verifyToken } from '../../../utils/verifyToken.js';
const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.post('/', /* verifyToken*/  projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);
router.put('/:projectId/assign', projectController.assignProject);

export default router;
