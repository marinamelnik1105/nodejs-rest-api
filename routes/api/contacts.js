const express = require('express');
const Joi = require('joi');

const contactsService = require("../../models/contacts")

const { HttpError } = require("../../helpers");

const router = express.Router();

const contactAddShema = Joi.object({
  name: Joi.string().required().messages({ "any.required": `missing required  name field` }),
  email: Joi.string().required().messages({ "any.required": `missing required email field` }),
  phone: Joi.string().required().messages({ "any.required": `missing required phone field` }),
})

router.get('/', async (req, res, next) =>
{
  try {
    const result = await contactsService.listContacts()
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }

})

router.get('/:contactId', async (req, res, next) =>
{
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result)
  } catch (error) {
    next(error);

  }

})

router.post('/', async (req, res, next) =>
{
  try {
    const { error } = contactAddShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }

})

router.delete('/:contactId', async (req, res, next) =>
{
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
      throw HttpError(404)
    }
    res.json({message:"contact deleted"})
  } catch (error) {
  next(error)}
})

router.put('/:contactId', async (req, res, next) =>
{
  try {
    const bodyLength = Object.keys(req.body).length;

    if (!bodyLength) {
       throw HttpError(400, "missing fields")
    }
    const { error } = contactAddShema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);
    
    if (!result) {
      throw HttpError(404)
    }
   
    res.json(result);
  } catch (error) {
    next(error)
  }

})

module.exports = router
