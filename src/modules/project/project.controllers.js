import Project from './project.model.js';
import ProjectNotification from './../projectNotification/projectNotification.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../user/user.model.js';
import { io } from '../../../index.js';

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
  const projectData = req.body;
  const decoded = jsonwebtoken.verify(req.header("Authorization"), JWT_SECRET);
  projectData.client.user = decoded.id;
  const newProject = await Project.create(projectData);
  
  //TODO: remove project from notification schema
  //TODO: asbtract to achieve SRP () role - role
  /**
   * params | chaining mongoose methods to end with exec() - get rid of (network requests) or (N+1 query problem).
   * {
   *    receiver: '',   optional
   *    role: '',       optional
   *    department: ''  optional
   * }
  */
 
 const branchManagers = await User.find({ "role": "branchManager" });
  const notificationsList = branchManagers.map( manager => ({
    project: newProject._id,
    receiver: manager._id,
    message: "A new project is now created!"
  }));
  
  ProjectNotification.insertMany(notificationsList)
  .then(()=>{
    io.emit('branch-managers-channel',{message: 'A new project is now created!'})
    res.json({message: " A new notification is sent "});
  })
  .catch( ()=>{
    res.json({ message: "Error during sending notifications "});
  })
  
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