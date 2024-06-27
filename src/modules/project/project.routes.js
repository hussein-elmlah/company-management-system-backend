import express from 'express';
import Project from './project.model.js';
import * as projectController from './project.controllers.js';
import { uploadSingleImage } from '../../../middlewares/fileUpload.js';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);
router.put('/:projectId/assign', projectController.assignProject);
router.put('/:projectId/employees', projectController.updateProjectEmployees);

router.post('/:projectId/pictures', uploadSingleImage, projectController.addProjectPicture);
router.delete('/:projectId/pictures/:pictureId', projectController.deleteProjectPicture);

router.post('/:projectId/pictures', uploadSingleImage, projectController.addProjectPicture);
router.delete('/:projectId/pictures/:pictureId', projectController.deleteProjectPicture);

export default router;
