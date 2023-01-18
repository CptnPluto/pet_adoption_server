const express = require("express");
const { validate } = require("uuid");
const router = express.Router();
const UsersController = require("../controllers/usersController");

const {
    isNewUser,
    validateBody,
    passwordsMatch,
    hashPwd,
    hashNewPwd,
    doesUserExist,
    auth,
    isAdmin,
} = require("../Middleware/usersMiddleware");
const { upload } = require("../Middleware/imagesMiddleware");
const { checkUserExistsModel } = require("../Models/usersModel");
const { userSchema } = require("../schemas/userSchema");

//TD: add middleware to check password and email. Extract logic from controller.
router.get("/", auth, UsersController.getUserData); // Get current user session
router.post(
    "/login",
    doesUserExist,
    passwordsMatch,
    UsersController.loginWithHash
);
router.post(
    "/signup",
    validateBody(userSchema),
    isNewUser,
    hashPwd,
    UsersController.signup
);
router.get("/logout", UsersController.logout);
router.put("/edit", auth, UsersController.editUser);
router.put(
    "/uploadPhoto",
    auth,
    upload.single("picture"),
    UsersController.editUser
);
router.put(
    "/changePass",
    auth,
    doesUserExist,
    passwordsMatch,
    hashNewPwd,
    UsersController.changePassword
);
router.get("/all", auth, isAdmin, UsersController.getAllUsers); // Get all users (admin only)

// Get user by ID
// router.get("/:param", UsersController.getUserById);

module.exports = router;

// Get pets with param route using query params
// .get((req, res) => {
//     try {
//         console.log("in pets query param route");
//         console.log(req.query);
//         res.send(`Getting all pets of type ${req.query.type}`);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(err.message);
//     }
// })

// Get pets with param route by path param
