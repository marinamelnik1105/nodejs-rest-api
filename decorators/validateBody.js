const { HttpError } = require("../helpers");

const validateBody = schema =>
{
    const func = (req, res, next) =>
    {
        const bodyLength = Object.keys(req.body).length;

        if (!bodyLength) {
            throw HttpError(400, "missing fields")
        }
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        }
        next()

    }
    return func;

}

const validateBodyForFavoriteRoute = schema =>
{
    const func = (req, res, next) =>
    {
        const bodyLength = Object.keys(req.body).length;

        if (!bodyLength) {
            throw HttpError(400, "missing field favorite")
        }
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        }
        next()

    }
    return func;

}
const validateBodyForVerify = schema =>
{
    const func = (req, res, next) =>
    {
        const bodyLength = Object.keys(req.body).length;

        if (!bodyLength) {
            throw HttpError(400, "missing required field email")
        }
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        }
        next()

    }
    return func;

}

module.exports = { validateBody, validateBodyForFavoriteRoute, validateBodyForVerify }