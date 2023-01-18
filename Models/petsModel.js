//TD: research path.resolve vs path.join
//TD: Delete non-relevant routes
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const dbConnection = require("../knex/knex");

// const dbConnection = require("../knex/knex");

const pathToPetsDB = path.resolve(__dirname, "../DBs/petsDB.json");

async function readAllPetsAsyncModel() {
    try {
        const pets = await dbConnection("pets").select("*");
        return pets;
    } catch (error) {
        console.log(error);
    }
}

// Write a new pet to DB - SYNC
async function addPetModel(pet) {
    try {
        const newPet = await dbConnection("pets").insert(pet);
        return newPet;
    } catch (error) {
        console.log(error);
    }
}

// Check if pet exists by name - ASYNC
async function doesPetExistModel(name) {
    const allPets = await readAllPetsAsyncModel();
    const foundPet = allPets.find((pet) => pet.name === name);
    return foundPet;
}

async function getPetByIdModel(petId) {
    try {
        const pet = await dbConnection("pets").where({ petId }).first();
        return pet;
    } catch (error) {
        console.log(error);
    }
}

async function searchPetsModel(searchCriteria) {
    let pets = [];
    try {
        for (const key in searchCriteria) {
            if (
                searchCriteria[key].length < 1 ||
                searchCriteria[key] === "" ||
                searchCriteria[key] === "all"
            ) {
                delete searchCriteria[key];
            }
        }
        const petsByCriteria = await dbConnection("pets").modify((query) => {
            for (const key in searchCriteria) {
                const val = searchCriteria[key];
                if (Array.isArray(val)) {
                    query.whereBetween(key, val);
                } else if (key === "name") {
                    query.where(key, "like", `%${val}%`);
                } else {
                    query.where(key, val);
                }
            }
        });
        return petsByCriteria;
    } catch (err) {
        console.log(err.message);
    }
}

async function getPetsByUserIdModel(userId) {
    try {
        const pets = await dbConnection("pets").where({ ownerId: userId });
        return pets;
    } catch (error) {
        console.log(error);
    }
}

async function getSavedPetsModel(id) {
    try {
        const petsList = [];
        const pets = await dbConnection("usersPetsList").where({ userId: id });
        for (let pet of pets) {
            pet = await dbConnection("pets").where({ petId: pet.petId });
            petsList.push(pet[0]);
        }
        return petsList;
    } catch (error) {
        console.log(error);
    }
}

async function savePetModel(petId, userId) {
    try {
        const savedPet = await dbConnection("usersPetsList").insert({
            userId: userId,
            petId: petId,
        });
        return savedPet;
    } catch (error) {
        console.log(error);
    }
}

async function unSavePetModel(petId, userId) {
    try {
        const unSavedPet = await dbConnection("usersPetsList")
            .where({ userId: userId, petId: petId })
            .del();
        return unSavedPet;
    } catch (error) {
        console.log(error);
    }
}

async function deletePetModel(id) {
    try {
        const pet = await dbConnection.table("pets").where({ petId: id }).del();
        return pet;
    } catch (err) {
        console.log(err);
    }
}

async function returnPetModel(id) {
    try {
        const pet = await dbConnection
            .table("pets")
            .where({ petId: id })
            .update({ ownerId: null, adoptionStatus: "Available" });
        return pet;
    } catch (error) {
        console.log(error);
    }
}

async function adoptOrFosterModel(petId, userId, update) {
    try {
        const pet = await dbConnection
            .table("pets")
            .where({ petId: petId })
            .update({ ownerId: userId, adoptionStatus: update });
        return pet;
    } catch (error) {
        console.log(error);
    }
}

//TD: Incorrect datetime value. Need to fix.
async function updatePetModel(petId, update) {
    try {
        const { created_at, ...toUpdate } = update;
        for (const key in toUpdate) {
            if (toUpdate[key] === "") {
                delete toUpdate[key];
            }
        }
        const result = await dbConnection
            .table("pets")
            .where({ petId: petId })
            .update(toUpdate);
        return update;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    readAllPetsAsyncModel,
    addPetModel,
    doesPetExistModel,
    getPetByIdModel,
    searchPetsModel,
    getPetsByUserIdModel,
    getSavedPetsModel,
    savePetModel,
    unSavePetModel,
    deletePetModel,
    returnPetModel,
    adoptOrFosterModel,
    updatePetModel,
};

// // Read all pets from DB - SYNC
// function readAllPetsModel() {
//     const allPets = fs.readFileSync(pathToPetsDB, "utf8");
//     return JSON.parse(allPets);
// }

// // Read all pets from DB - ASYNC
// function readAllPetsAsyncModel() {
//     //TD: Check if we need this return new Promise thing.
//     return new Promise((resolve, reject) => {
//         fs.readFile(pathToPetsDB, "utf8", (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(JSON.parse(data));
//             }
//         });
//     });
// }
