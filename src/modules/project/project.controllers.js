import Project from './project.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../user/user.model.js';
import webPush from 'web-push';
import bodyParser from 'body-parser';

dotenv.config({ path: './.env' });
const { JWT_SECRET } = process.env;

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
  /**
   * get username of whoever created that project
   * get all branchManager(s) 
   * send them all real-time notifications with the username.
   */
  const projectData = req.body;
  await Project.create(projectData);
  const decoded = jsonwebtoken.verify(req.header("Authorization"), JWT_SECRET);
  const senderUsername = decoded.username;
  const branchManagers = await User.find({ "role": "branchManager" });
  webPush.setVapidDetails('mailto:test@mail.com', process.env.publicKey, process.env.privateKey);
  res.status(201).json({
    "publicKey": process.env.publicKey,
    "privateKey": process.env.privateKey,
  });
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