import ProjectNotification from './projectNotification.model.js';
import asyncHandler from '../../../lib/asyncHandler.js';
import CustomError from '../../../lib/customError.js';
import { handleQueryParams } from '../../../utils/handleQueryParams.js';
import { io } from '../../../index.js';
import User from '../user/user.model.js';

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
export const sendNotification = (option, data) => {
  
  const options = {

    receiver: (param) => { 
      console.log('Handling option1 with', param); 
    },

    role: async ({project_id, role}) => { 
      const branchManagers = await User.find({ "role": role });
      const notificationsList = branchManagers.map( manager => ({
        project: project_id,
        receiver: manager._id,
        message: "A new project is now created!"
      }));
      
        await ProjectNotification.insertMany(notificationsList)
        io.emit('branch-managers-channel',{message: 'A new project is now created!'}) 
    },

    department: (param) => { 
      console.log('Handling option3 with', param); 
    }

  };

  const handler = options[option];
  handler(data);
};

// Usage
// sendNotification('receiver', { project_id: '', role: 'branchManager' });
// sendNotification('role', );
// sendNotification('department', [1, 2, 3]);


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
  