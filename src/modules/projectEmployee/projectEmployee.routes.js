import express from 'express';
import * as projectEmployeeController from './projectEmployee.controllers.js';

const router = express.Router();

router.get('/', projectEmployeeController.getAllProjectEmployees);
router.get('/:projectEmployeeId', projectEmployeeController.getProjectEmployeeById);
router.post('/', projectEmployeeController.createProjectEmployee);
router.put('/:projectEmployeeId', projectEmployeeController.updateProjectEmployee);
router.delete('/:projectEmployeeId', projectEmployeeController.deleteProjectEmployee);

export default router;
