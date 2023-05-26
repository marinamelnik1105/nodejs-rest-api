const express = require('express');

const contactsController = require("../../controllers/contacts-controller")

const schemas = require("../../schemas/contacts-schemas");

const { validateBody } = require("../../decorators/validateBody")
const router = express.Router();

router.get('/', contactsController.listContacts)

router.get('/:contactId', contactsController.getContactById)

router.post('/', validateBody(schemas.contactAddShema), contactsController.addContact)

router.delete('/:contactId', contactsController.removeContact)

router.put('/:contactId', validateBody(schemas.contactAddShema), contactsController.updateContact)

module.exports = router
