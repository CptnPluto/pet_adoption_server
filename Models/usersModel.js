//TD: research path.resolve vs path.join
//TD: dlete non-relevant routes
const fs = require("fs");
const path = require("path");
const dbConnection = require("../knex/knex");

// Read all users from DB - ASYNC
async function readAllUsersAsyncModel() {
    //TD: Check if we need this return new Promise thing.
    try {
        const allUsers = await dbConnection.select("*").from("users");
        return allUsers;
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function getUserByEmailModel(email) {
    try {
        const user = await dbConnection("users")
            .where({ email: email })
            .first();
        return user;
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function getUserById(id) {
    try {
        const [user] = await dbConnection("users").where({ id: id });
        return user;
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

// Write a new user to DB - SYNC
async function addUserModel(user) {
    try {
        const [id] = await dbConnection("users").insert(user);
        return id;
    } catch (error) {
        console.log(error);
    }
}

async function checkUserExistsModel(email) {
    const user = await getUserByEmailModel(email);
    if (user) {
        return user;
    } else {
        return false;
    }
}

// TD: Make this function neater. Remove the edited user definnition?
async function editUserModel(userInfo) {
    console.log("User info: ", userInfo);
    const { created_at, ...toEdit } = userInfo;
    try {
        const response = await dbConnection("users")
            .where({ id: userInfo.id })
            .update({ ...toEdit });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function updatePassModel(userInfo) {
    try {
        const response = await dbConnection("users")
            .where({ id: userInfo.id })
            .update({ password: userInfo.newPass });
        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    readAllUsersAsyncModel,
    addUserModel,
    getUserByEmailModel,
    editUserModel,
    getUserById,
    checkUserExistsModel,
    updatePassModel,
};
