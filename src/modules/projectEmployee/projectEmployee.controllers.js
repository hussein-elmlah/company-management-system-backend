import ProjectEmployee from './projectEmployee.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';

// @desc    Get all project employees
// @route   GET /project-employees
// @access  Public
export const getAllProjectEmployees = asyncHandler(async (req, res) => {
    const result = await handleQueryParams(ProjectEmployee, req.query);
    res.json(result);
});

// @desc    Get project employee by ID
// @route   GET /project-employees/:projectEmployeeId
// @access  Public
export const getProjectEmployeeById = asyncHandler(async (req, res) => {
  const { projectEmployeeId } = req.params;
  const projectEmployee = await ProjectEmployee.findById(projectEmployeeId);
  if (!projectEmployee) {
    throw new CustomError('Project employee not found', 404);
  }
  res.json(projectEmployee);
});

// @desc    Create a new project employee
// @route   POST /project-employees
// @access  Public
export const createProjectEmployee = asyncHandler(async (req, res) => {
  const projectEmployeeData = req.body;
  const newProjectEmployee = await ProjectEmployee.create(projectEmployeeData);
  res.status(201).json(newProjectEmployee);
});

// @desc    Update project employee by ID
// @route   PUT /project-employees/:projectEmployeeId
// @access  Public
export const updateProjectEmployee = asyncHandler(async (req, res) => {
  const { projectEmployeeId } = req.params;
  const updatedFields = req.body;
  const updatedProjectEmployee = await ProjectEmployee.findByIdAndUpdate(projectEmployeeId, updatedFields, { new: true });
  if (!updatedProjectEmployee) {
    throw new CustomError('Project employee not found', 404);
  }
  res.json(updatedProjectEmployee);
});

// @desc    Delete project employee by ID
// @route   DELETE /project-employees/:projectEmployeeId
// @access  Public
export const deleteProjectEmployee = asyncHandler(async (req, res) => {
  const { projectEmployeeId } = req.params;
  const deletedProjectEmployee = await ProjectEmployee.findByIdAndDelete(projectEmployeeId);
  if (!deletedProjectEmployee) {
    throw new CustomError('Project employee not found', 404);
  }
  res.json({ message: 'Project employee deleted successfully' });
});
