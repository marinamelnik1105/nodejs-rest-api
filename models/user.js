const { Schema, model } = require("mongoose");

const Joi = require('joi');

const { handleMongooseError } = require("../helpers");


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    avatarURL: {
        type: String,
    },

    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },

    token: String

}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string()
})

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})
const emailSchema = Joi.object({
    email: Joi.string().required(),
})
const schemas = {
    registerSchema,
    loginSchema,
    emailSchema
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas
}