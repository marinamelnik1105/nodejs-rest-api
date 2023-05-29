const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

const { ctrlWrapper } = require("../decorators/ctrlWrapper")

const listContacts = async (req, res) =>
{
    const result = await Contact.find()
    res.json(result);
}

const getContactById = async (req, res) =>
{
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result)
}

const addContact = async (req, res) =>
{
    const result = await Contact.create(req.body);
    res.status(201).json(result)
}

const removeContact = async (req, res) =>
{
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
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
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!result) {
        throw HttpError(404)
    }
    res.json(result);
}

const updateStatusContact = async (req, res) =>
{
    const bodyLength = Object.keys(req.body).length;

    if (!bodyLength) {
        throw HttpError(400, "missing field favorite")
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

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
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}