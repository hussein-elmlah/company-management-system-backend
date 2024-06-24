import Project from './project.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'
import * as ProjectNotificationController from '../projectNotification/projectNotification.controllers.js';

dotenv.config({ path: './.env' });
const { JWT_SECRET } = process.env;

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
  const decoded = jsonwebtoken.verify(req.header("Authorization"), JWT_SECRET);
  projectData.client.user = decoded.id;
  const newProject = await Project.create(projectData);
   
  await ProjectNotificationController.sendNotification('role', { project_id: newProject._id, role: 'branchManager', message: "trial message" });
  res.json({message: " A new notification is sent "});  
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