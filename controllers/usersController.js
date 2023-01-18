const {
    readAllUsersAsyncModel,
    addUserModel,
    getUserByEmailModel,
    editUserModel,
    getUserById,
    updatePassModel,
} = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function getAllUsers(req, res) {
    try {
        const users = await readAllUsersAsyncModel();
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

// NEW - NEED TO UPDATE TO USE THIS, NOT THE OLD ONE
//TD: make this into a model?
const loginWithHash = async (req, res) => {
    const { user, password } = req.body;
    try {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else if (!result) {
                res.status(401).send("Incorrect password");
            } else {
                // const token = jwt.sing( { payload: payload }, my_secret_key, { options})
                const token = jwt.sign(
                    { id: user.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "12h" }
                );
                res.cookie("token", token, {
                    maxAge: 86000000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                });
                res.send({ user: user, ok: true });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

function logout(req, res) {
    try {
        console.log("logging out");
        res.clearCookie("token");
        res.send("Logged out");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function signup(req, res) {
    try {
        const userId = await addUserModel(req.body);
        res.send({ userId: userId, ok: true }); // apparently you can't just send the id, because it will think it's a status code
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function editUser(req, res) {
    try {
        if (req.body.userId) {
            delete req.body.userId;
        }
        if (req.file) {
            req.body.picture = req.file.path;
        }
        const editedUser = await editUserModel(req.body);
        if (editedUser) {
            res.send({ ok: true });
        } else {
            res.send({ ok: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function getUserData(req, res) {
    try {
        const user = await getUserById(req.body.userId);
        const { password, ...toSend } = user;
        res.send(toSend);
    } catch (err) {
        console.log("Error getting user data: ", err);
        res.status(500).send(err.message);
    }
}

async function changePassword(req, res) {
    try {
        console.log("Changing password", req.body.newPass);
        const editedUser = await updatePassModel(req.body);
        console.log("Edited user: ", editedUser);
        res.send({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getAllUsers,
    getUserByEmailModel,
    logout,
    editUser,
    loginWithHash,
    signup,
    getUserData,
    changePassword,
};
