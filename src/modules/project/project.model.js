import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    client: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      fullName: { type: String },
      mobileNumber: { type: String },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    hoursExpectedPerDepartment: { type: Map, of: Number },
    annex: {
      upper: { type: Boolean, default: false },
      land: { type: Boolean, default: false },
    },
    name: { type: String },
    number: { type: Number },
    priority: { type: Number },
    projectStatus: {
      type: String,
      enum: ['accepted', 'rejected', 'pending'],
      default: 'pending'
    },
    location: { type: String },
    planNumber: { type: String },
    plotNumber: { type: String },
    landPerimeter: { type: Number },
    landArea: { type: Number },
    dateOfSubmission: { type: Date },
    program: {
      type: String,
      enum: ['autocad', 'revit']
    },
    type: {
      type: String,
      enum: ["villa", "residential", "administrative", "commercial", "other"],
    }, 
    numberOfFloors: { type: Number },
    buildingArea: { type: Number },
    totalBuildingArea: { type: Number },
    hoursExpectedToComplete: { type: Number },
    expectedStartDate: { type: Date },
    actualStartDate: { type: Date },
    expectedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    fileLinkOriginal: { type: String },
    fileLinkFinal: { type: String },
    projectPictures: [{ type: String }],
    description: { type: String },
    participatingDepartments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
    employees: [{
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      hoursWorked: { type: Number }
    }]
  },
  {
    timestamps: true,
    runValidators: true,
  }
);

projectSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

projectSchema.pre('findOneAndUpdate', async function preUpdate(next) {
  try {
    this.options.runValidators = true;
    return next();
  } catch (error) {
    return next(error);
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
