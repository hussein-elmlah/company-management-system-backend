import mongoose from 'mongoose';

const projectEmployeeSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on leave'],
    default: 'active'
  },
},
{ 
  timestamps: true,
  runValidators: true,
},
);

// Define compound unique index on project and employee fields
projectEmployeeSchema.index({ project: 1, employee: 1 }, { unique: true });

const ProjectEmployee = mongoose.model('ProjectEmployee', projectEmployeeSchema);

export default ProjectEmployee;
