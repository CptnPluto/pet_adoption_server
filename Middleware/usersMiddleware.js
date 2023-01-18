const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Ajv = require("ajv");
const {
    getUserByEmailModel,
    checkUserExistsModel,
    getUserById,
} = require("../Models/usersModel");
const { JsonWebTokenError } = require("jsonwebtoken");

// Import AJV validation - https://ajv.js.org/
const ajv = new Ajv();

async function isNewUser(req, res, next) {
    console.log("Checking email: ", req.body.email);
    const user = await checkUserExistsModel(req.body.email);
    if (user) {
        res.status(400).send(
            "That email already exists. Please choose another."
        );
        return;
    }
    console.log("User does not exist yet.");
    next();
}

async function doesUserExist(req, res, next) {
    const user = await checkUserExistsModel(req.body.email);
    if (!user) {
        res.status(400).send("User does not exist.");
        return;
    }
    req.body.user = user; //new - needs testing
    console.log("Good user.");
    next();
}

async function passwordsMatch(req, res, next) {
    console.log("Checking password: ", req.body.password);
    // const user = await getUserByEmailModel(req.body.email);
    const user = req.body.user; // new - needs testing
    const storedPass = user.password;
    const valid = await bcrypt.compare(req.body.password, storedPass);
    if (!valid) {
        console.log("Incorrect password");
        res.status(400).send("Incorrect Password");
        return;
    }
    console.log("Password checks out. Groovy.");
    next();
}

function validateBody(schema) {
    return (req, res, next) => {
        // const data = { foo: 1, bar: "abc" };
        const valid = ajv.validate(schema, req.body);
        if (!valid) {
            console.log("Invalid body");
            res.status(400).send(ajv.errors);
            return;
        }
        console.log("Good body");
        next();
    };
}

const hashPwd = (req, res, next) => {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log("Error hashing password: ", err);
            res.status(500).send(err.message);
            return;
        }
        console.log("Hashed password: ", hash);
        req.body.password = hash;
        next();
    });
};

const hashNewPwd = (req, res, next) => {
    const saltRounds = 10;
    bcrypt.hash(req.body.newPass, saltRounds, function (err, hash) {
        if (err) {
            console.log("Error hashing password: ", err);
            res.status(500).send(err.message);
            return;
        }
        console.log("Hashed password: ", hash);
        req.body.newPass = hash;
        next();
    });
};

//NEW MIDDLEWARE - NEED TO TEST AND INCORPORATE - MIGHT NEED TO MOVE TO PETS MIDDLEWARE

const auth = (req, res, next) => {
    if (!req.cookies) {
        console.log("No cookies");
        res.status(401).send("Cookies required");
        return;
    }
    const { token } = req.cookies;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Unauthorized");
            return;
        }

        if (decoded) {
            req.body.userId = decoded.id;
            next();
            return;
        }
    });
};

const isAdmin = async (req, res, next) => {
    const user = await getUserById(req.body.userId);
    console.log("User: ", user);
    if (user.admin) {
        next();
    } else {
        res.status(401).send("Unauthorized");
        return;
    }
};

module.exports = {
    doesUserExist,
    validateBody,
    passwordsMatch,
    isNewUser,
    hashPwd,
    hashNewPwd,
    auth,
    isAdmin,
};
