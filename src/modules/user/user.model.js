import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required! "],
      validate: {
        async validator(value) {
          const existingUser = await this.constructor.findOne({
            username: value,
          });
          return !existingUser;
        },
        message: "Please choose another username ",
      },
    },
    password: { type: String, required: [true, "Password is required! "] },
    role: {
      type: String,
      enum: ["client", "junior", "senior", "branchManager"],
      required: true,
      default: "client",
    },
    firstName: { type: String, required: [true, "First name is required! "] },
    lastName: { type: String, required: [true, "Last name is required! "] },
    dateOfBirth: { type: Date },
    address: { type: String },
    jobLevel: { type: String },
    mobileNumber: {
      type: String,
      validate: [validator.isMobilePhone, "Please enter a valid phone number"],
       
    },


    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },


    email: {
      type: String,
      unique: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "Please enter a valid email ",
        },
        {
          async validator(value) {
            const existingUser = await this.constructor.findOne({
              email: value,
            });
            return !existingUser;
          },
          message: "This email already exists, please choose another one ",
        },
      ],
      required: [true, "Please enter an email"],
    },
    contract: {
      number: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      salary: { type: Number },
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
