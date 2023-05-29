const { Schema, model } = require("mongoose");

const Joi = require('joi');

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true })

contactSchema.post("save", handleMongooseError);

const contactAddShema = Joi.object({
    name: Joi.string().required().messages({ "any.required": `missing required  name field` }),
    email: Joi.string().required().messages({ "any.required": `missing required email field` }),
    phone: Joi.string().required().messages({ "any.required": `missing required phone field` }),
    favorite: Joi.boolean()
})

const updateStatusContactSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const schemas = {
    contactAddShema,
    updateStatusContactSchema
}

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    schemas
};