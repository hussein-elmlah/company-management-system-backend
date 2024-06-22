import ProjectNotification from './projectNotification.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';

export const getAllProjectNotifications = asyncHandler(async (req, res) => {
  const result = await handleQueryParams(ProjectNotification, req.query, 'name');
  res.json(result);
});


export const createProjectNotification = asyncHandler(async (req, res) => {
const notificationInfo = req.body;
const newProjectNotification = await ProjectNotification.create(notificationInfo);
res.status(201).json(newProjectNotification);
});


export const updateProjectNotification = asyncHandler(async (req, res) => {
const { notificationId } = req.params;
const updatedFields = req.body;

const updatedProjectNotification = await ProjectNotification.findByIdAndUpdate(notificationId, updatedFields, { new: true });

if (!updatedProjectNotification) {
  throw new CustomError('ProjectNotification not found', 404);
}

res.json(updatedProjectNotification);
});

