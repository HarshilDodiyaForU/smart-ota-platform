import mongoose, { type InferSchemaType, Schema } from "mongoose";

/**
 * User model for auth. Passwords are stored as bcrypt hashes; never store plaintext.
 * role: "user" | "admin" — enables future RBAC (e.g. admin-only endpoints).
 */
export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export type UserDoc = InferSchemaType<typeof userSchema> & mongoose.Document;
export const User = mongoose.model<UserDoc>("User", userSchema);
