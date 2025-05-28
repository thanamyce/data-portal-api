import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserRole {
  ADMIN = 'ADMIN',
  CO_ADMIN = "CO_ADMIN",
  USER = 'USER',
  SUPERVISOR = 'SUPERVISOR',
  DESIGNER = 'DESIGNER',
  DATA_ENGINEER='DATA_ENGINEER'
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
   
  @Prop({unique: true, required: true})
  _id: string;
  
  @Prop({ required: true, unique: true, index: true })
  email: string;

  // Make password optional or allow it to be null
  @Prop({ required: false })
  password: string; // You can make it required false if you want to delete it in some scenarios

  @Prop({ required: true }) // Make firstName mandatory
  firstName: string;

  @Prop({ required: true }) // Make lastName mandatory
  lastName: string;

  @Prop({ enum: UserRole, default: UserRole.USER, index: true })
  role: UserRole;

  // Store OTP expiration time

  @Prop({ default: null, index: true })  // ✅ Add refresh token field
  refreshToken?: string; // Store hashed refresh token

  @Prop({type: Boolean, default: true})
  isActive: boolean;

  @Prop()
  forgetPasswordToken: string;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create compound indexes for common query patterns
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ _id: 1, refreshToken: 1 });