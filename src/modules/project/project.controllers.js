import Project from './project.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import User from '../user/user.model.js';
import Department from '../department/department.model.js';
import ProjectEmployee from '../projectEmployee/projectEmployee.model.js';
// @desc    Get all projects
// @route   GET /projects
// @access  Public
export const getAllProjects = asyncHandler(async (req, res) => {
    const result = await handleQueryParams(Project, req.query, 'name');
    res.json(result);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new CustomError('Project not found', 404);
  }

  res.json(project);
});

export const createProject = asyncHandler(async (req, res) => {
  const projectData = req.body;
  const newProject = await Project.create(projectData);
  res.status(201).json(newProject);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const updatedFields = req.body;
  const updatedProject = await Project.findByIdAndUpdate(projectId, updatedFields, { new: true });

  if (!updatedProject) {
    throw new CustomError('Project not found', 404);
  }

  res.json(updatedProject);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    throw new CustomError('Project not found', 404);
  }

  res.json({ message: 'Project deleted successfully' });
});

export const assignProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { departments, employees } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new CustomError('Project not found', 404);
  }

  // Assign departments by name
  if (departments && Array.isArray(departments)) {
    for (const departmentName of departments) {
      const department = await Department.findOne({ name: departmentName.toLowerCase() });
      if (!department) {
        throw new CustomError(`Department not found: ${departmentName}`, 404);
      }
      if (!project.participatingDepartments.includes(department._id)) {
        project.participatingDepartments.push(department._id);
      }
    }
  }

  // Assign employees and hours by name or type
  if (employees && Array.isArray(employees)) {
    for (const { employeeName, employeeType, hoursWorked } of employees) {
      const query = {};
      if (employeeName) {
        const [firstName, ...lastNameParts] = employeeName.split(' ');
        query.firstName = firstName.toLowerCase();
        query.lastName = lastNameParts.join(' ').toLowerCase();
      }
      if (employeeType) query.jobLevel = employeeType;

      const employee = await User.findOne(query);
      if (!employee) {
        throw new CustomError(`Employee not found: ${employeeName || employeeType}`, 404);
      }

      let projectEmployee = await ProjectEmployee.findOne({ project: projectId, employee: employee._id });
      if (!projectEmployee) {
        projectEmployee = new ProjectEmployee({
          project: projectId,
          employee: employee._id,
          hoursWorked
        });
      } else {
        projectEmployee.hoursWorked = hoursWorked;
      }

      await projectEmployee.save();
    }
  }

  await project.save();
  res.status(200).json({ message: 'Project assignments updated successfully', project });
});