import mongoose from 'mongoose';

export const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set(value) {
      return value.toLowerCase();
    },
    validate: {
      async validator(value) {
        const existingDept = await mongoose.models.Department.findOne({
          name: value,
        });
        return !existingDept;
      },
      message: 'Please choose another department name  🤨',
    },
  },
},
{ 
  timestamps: true,
  runValidators: true,
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
