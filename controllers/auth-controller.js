const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require('../models/user');

const { HttpError, sendEmail } = require("../helpers");

const { ctrlWrapper } = require("../decorators/ctrlWrapper");

const { SECRET_KEY, PROJECT_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) =>
{
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const veryfyEmail = {
        to: email,
        subject: "veryfyEmail",
        html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${verificationToken}"> Click to verify email</a>`
    };
    await sendEmail(veryfyEmail);
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }


    })
}

const verify = async (req, res) =>
{
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id,
        { verify: true, verificationToken: null });
    res.json({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) =>
{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404);
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }
    const veryfyEmail = {
        to: email,
        subject: "veryfyEmail",
        html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${user.verificationToken}"> Click to verify email</a>`
    };
    await sendEmail(veryfyEmail);

    res.json({
        message: "Verification email sent"
    })

}

const login = async (req, res) =>
{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.verify) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }

    const { _id: id, subscription } = user;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token,
        user: {
            email,
            subscription: subscription,
        }

    })
}

const getCurrent = async (req, res) =>
{
    const { email, subscription } = req.user;
    res.json({ email, subscription })
}

const logout = async (req, res) =>
{
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "No Content"
    })
}

const updateAvatar = async (req, res) =>
{
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsDir, filename);

    const avatarProcess = await Jimp.read(tmpUpload);
    const avatarProcessResize = avatarProcess.resize(250, 250);
    await avatarProcessResize.writeAsync(tmpUpload);

    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL, })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}