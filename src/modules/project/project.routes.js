import express from 'express';
import * as projectController from './project.controllers.js';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

export default router;
