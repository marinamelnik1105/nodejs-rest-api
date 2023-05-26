
const contactsService = require("../models/contacts")

const { HttpError } = require("../helpers");

const { ctrlWrapper } = require("../decorators/ctrlWrapper")

const listContacts = async (req, res) =>
{
    const result = await contactsService.listContacts()
    res.json(result);
}

const getContactById = async (req, res) =>
{
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result)
}

const addContact = async (req, res) =>
{
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result)
}

const removeContact = async (req, res) =>
{
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
        throw HttpError(404)
    }
    res.json({ message: "contact deleted" })
}

const updateContact = async (req, res) =>
{
    const bodyLength = Object.keys(req.body).length;

    if (!bodyLength) {
        throw HttpError(400, "missing fields")
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);

    if (!result) {
        throw HttpError(404)
    }
    res.json(result);
}


module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact)
}