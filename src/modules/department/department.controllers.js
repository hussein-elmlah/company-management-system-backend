  import Department from './department.model.js';
  import asyncHandler from '../../../lib/asyncHandler.js';
  import CustomError from '../../../lib/customError.js';
  import { handleQueryParams } from '../../../utils/handleQueryParams.js';

// @desc    Get all departments
// @route   GET /departments
// @access  Public
export const getAllDepartments = asyncHandler(async (req, res) => {
    const result = await handleQueryParams(Department, req.query, 'name');
    res.json(result);
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const department = await Department.findById(departmentId);

  if (!department) {
    throw new CustomError('Department not found', 404);
  }

  res.json(department);
});

export const createDepartment = asyncHandler(async (req, res) => {
  const departmentData = req.body;
  const newDepartment = await Department.create(departmentData);
  res.status(201).json(newDepartment);
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const updatedFields = req.body;

  const updatedDepartment = await Department.findByIdAndUpdate(departmentId, updatedFields, { new: true });

  if (!updatedDepartment) {
    throw new CustomError('Department not found', 404);
  }

  res.json(updatedDepartment);
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const deletedDepartment = await Department.findByIdAndDelete(departmentId);

  if (!deletedDepartment) {
    throw new CustomError('Department not found', 404);
  }

  res.json({ message: 'Department deleted successfully' });
});
