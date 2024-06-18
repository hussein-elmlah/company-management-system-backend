// routes/departments.js
import express from 'express';
import * as departmentController from './department.controllers.js';

const router = express.Router();

router.get('/', departmentController.getAllDepartments);
router.get('/:departmentId', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:departmentId', departmentController.updateDepartment);
router.delete('/:departmentId', departmentController.deleteDepartment);

export default router;
