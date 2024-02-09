import mongoose, { CallbackError, Document, Model, Schema } from "mongoose";
import { IPerson } from "./person";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from 'bcrypt';
import { Logger } from "../../libraries/logger";

export interface IUser {
  person: IPerson;
  password: string;
  token?: string;
}

interface IUserModel extends IUser, Document { comparePassword(candidatePassword: string): Promise<boolean>; }

const UserSchema: Schema = new Schema(
  {
    person: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Person",
      unique: true,
      trim: true,
    },
    token: { type: String },
    password: { type: String, required: true, select: false },
  },
  { versionKey: false, timestamps: true }
);

// Middleware to hash the password before saving
UserSchema.pre<IUserModel>("save", async function (next) {
  const user = this;

  // Hash the password only if it's modified or a new user
  if (!user.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plain password with the hashed one
    user.password = hashedPassword;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Add a method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const hashedPassword = this.password; // Get the hashed password from the user document
  const matched = await bcrypt.compare(candidatePassword, hashedPassword);
  Logger.i('user comparePassword -- matched ', matched);
  return matched;
};

UserSchema.plugin(uniqueValidator);

export default mongoose.model<IUserModel>("User", UserSchema);

