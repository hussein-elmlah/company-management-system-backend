import ProjectNotification from './projectNotification.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import { io } from '../../../index.js';
import User from '../user/user.model.js';
import Department from '../department/department.model.js';
import Project from '../project/project.model.js';

export const getAllProjectNotifications = asyncHandler(async (req, res) => {
  const result = await handleQueryParams(ProjectNotification, req.query, 'name');
  res.json(result);
});

const sendToAll = async ({usersList, project_id, channel, message, redirectURL = ''}) => {

  if (Array.isArray(usersList)) {
    const notificationsList = usersList.map( user => ({
      ...(project_id && { project: project_id }),
      receiver: user._id,
      message,
      redirectURL
    }));
    
    await ProjectNotification.insertMany(notificationsList)
    io.emit(`${channel}-channel`,{message});

  } else{    // receiver object

    await ProjectNotification.create({project: project_id, receiver: usersList, message, redirectURL})
    io.emit(`${channel}-channel`,{message}) 

  }
}

export const sendNotification = async ({option, data}) => {
  
  const options = {
    receiver: async ({project_id, message, redirectURL}) => { 
      const usersList =  await Project.findOne({ "_id": project_id }, 'client');
      await sendToAll({usersList: usersList.client.user, project_id, channel: usersList.client.user, message, redirectURL});
    },

    role: async ({project_id = null, role, message, redirectURL}) => { 
      const usersList = await User.find({ "role": role });
      await sendToAll({usersList, project_id, channel: role, message, redirectURL});
    },

    department: async ({project_id, department}) => {       
      const usersList = await Department.find({ "name": department });
      await sendToAll({usersList, project_id, channel: department});
    }
  };

  const handler = options[option];
  handler(data);
};


export const updateUserProjectNotification = asyncHandler(async (req, res) => {
const { userId } = req.params;
const dataToBeUpdatedWith = req.body;

const updatedProjectNotification = await ProjectNotification.updateMany({receiver: userId, isRead: false}, dataToBeUpdatedWith);
io.emit(`branchManager-channel`, 'updated') ;

res.json({message: "done"});
});

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const MyNotifications = await ProjectNotification.find({receiver: userId}).sort({ createdAt: -1 }).limit(7);
  
  if (!MyNotifications) {
    throw new CustomError('You got no notifications', 404);
  }
  
  res.json(MyNotifications);
});

export const storeNotification = asyncHandler(async (req, res) => {

  const newNotification = await sendNotification(req.body);
  
  res.json({
    message: "Your notification has been sent!"
  });

});
  