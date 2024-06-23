import ProjectNotification from './projectNotification.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import { io } from '../../../index.js';
import User from '../user/user.model.js';
import Department from '../department/department.model.js';

export const getAllProjectNotifications = asyncHandler(async (req, res) => {
  const result = await handleQueryParams(ProjectNotification, req.query, 'name');
  res.json(result);
});

/**
 * 
 * params | chaining mongoose methods to end with exec() - get rid of (network requests) or (N+1 query problem).
 * {
 *    receiver: '',   optional
 *    role: '',       optional
 *    department: ''  optional
 * }
 */

const sendToAll = async ({usersList, project_id, channel, message}) => {

  if (Array.isArray(usersList)) {
    const notificationsList = usersList.map( user => ({
      project: project_id,
      receiver: user._id,
      message
    }));
    
    await ProjectNotification.insertMany(notificationsList)
    io.emit(`${channel}-channel`,{message});

  } else if(typeof usersList === 'string'){    

    await ProjectNotification.create({project: project_id, receiver: usersList._id, message})
    io.emit(`${channel}-channel`,{message}) 

  }
}

export const sendNotification = async (option, data) => {
  
  const options = {
    receiver: async ({project_id, username}) => { 
      const usersList = await User.find({ "username": username });
      await sendToAll({usersList, project_id, channel: role});
    },

    role: async ({project_id, role, message}) => { 
      const usersList = await User.find({ "role": role });
      return await sendToAll({usersList, project_id, channel: role, message});
    },

    department: async ({project_id, department}) => {       
      const usersList = await Department.find({ "name": department });
      await sendToAll({usersList, project_id, channel: department});
    }
  };

  const handler = options[option];
  return await handler(data);
};


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

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const MyNotifications = await ProjectNotification.find({receiver: userId});
  
  if (!MyNotifications) {
    throw new CustomError('You got no notifications', 404);
  }
  
  res.json(MyNotifications);
  });
  