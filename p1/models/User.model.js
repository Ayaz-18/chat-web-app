import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
        unique: true,


    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String,
        default: ""
    },
    isverified: {
        type: Boolean,
        default: false
    },
    profilepic: { type: String, default: "" },
    bio: {
        type: String,
        default: ""
    }


}, { timestamps: true })

UserSchema.pre("save", async function () {
    // Only hash if password is new or modified
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.isspasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", UserSchema)