import mongoose from 'mongoose';

const projectNotificationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'N/A'
  },
},
{ 
  timestamps: true,
},
);

const projectNotification = mongoose.model('projectNotification', projectNotificationSchema);

export default projectNotification;
