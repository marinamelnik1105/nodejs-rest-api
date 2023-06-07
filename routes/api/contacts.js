const express = require('express');

const contactsController = require("../../controllers/contacts-controller")

const { schemas } = require("../../models/contact");

const { validateBodyForFavoriteRoute, validateBody } = require("../../decorators/validateBody")

const { isValidId, authenticate } = require("../../middlewares")

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.listContacts)

router.get('/:contactId', isValidId, contactsController.getContactById)

router.post('/', validateBody(schemas.contactAddShema), contactsController.addContact)

router.delete('/:contactId', isValidId, contactsController.removeContact)

router.put('/:contactId', isValidId, validateBody(schemas.contactAddShema), contactsController.updateContact)

router.patch("/:contactId/favorite", isValidId, validateBodyForFavoriteRoute(schemas.updateStatusContactSchema), contactsController.updateStatusContact)

module.exports = router
