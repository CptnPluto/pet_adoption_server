const dbConnection = require("../knex/knex");
const {
    readAllPetsAsyncModel,
    addPetModel,
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
} = require("../Models/petsModel");

async function getAllPets(req, res) {
    try {
        const pets = await readAllPetsAsyncModel();
        res.send(pets);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function addNewPet(req, res) {
    try {
        console.log("in addNewPet controller", req.body);
        if (req.body.userId) {
            delete req.body.userId;
        }
        console.log("File path: ", req.file.path);
        req.body.picture = req.file.path;
        const newPet = req.body;
        const addedPet = await addPetModel(newPet);
        console.log("controller addedPet", addedPet);
        res.status(200).send(addedPet);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function getPetById(req, res) {
    try {
        const { id } = req.params;
        const pet = await getPetByIdModel(id);
        if (!pet) {
            res.status(404).send("Pet not found");
        }
        console.log("Found pet: ", pet);
        res.send(pet);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function searchPets(req, res) {
    try {
        const searchCriteria = req.body;
        const pets = await searchPetsModel(searchCriteria);
        console.log("Found pets: ", pets);
        res.send(pets);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function getPetsByUserId(req, res) {
    try {
        const pets = await getPetsByUserIdModel(req.params.id);
        if (!pets) {
            res.status(404).send("Pets not found");
            return;
        }
        res.send(pets);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function adoptOrFoster(req, res) {
    try {
        const { petId, userId, update } = req.params;
        const result = await adoptOrFosterModel(petId, userId, update);
        if (!result) {
            res.status(404).send("Pet not found");
            return;
        }
        console.log("Added ownerId to pet: ", result);
        res.send({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function returnPet(req, res) {
    try {
        console.log("returnPet", req.params.petId);
        const pet = await returnPetModel(req.params.petId);
        if (!pet) {
            res.status(404).send("Pet not found");
            return;
        }
        res.send({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function savePet(req, res) {
    try {
        const { petId, userId } = req.params;
        const petSaved = await savePetModel(petId, userId);
        console.log(petSaved);
        if (!petSaved) {
            res.status(404).send("Pet not found");
            return;
        }
        res.status(200).send({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function unSavePet(req, res) {
    try {
        const { petId, userId } = req.params;
        const petUnSaved = await unSavePetModel(petId, userId);
        console.log("Pet unSaved: ", petUnSaved);
        if (!petUnSaved) {
            res.status(404).send("Pet not found");
            return;
        }
        res.send({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function getSavedPets(req, res) {
    try {
        const petsList = await getSavedPetsModel(req.params.id);
        if (!petsList) {
            res.status(500).send("Error adding pet to saved list.");
        }
        res.send(petsList);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function deletePet(req, res) {
    try {
        const result = await deletePetModel(req.params.id);
        if (!result) {
            res.status(404).send("Pet not found");
            return;
        }
        console.log("Found pet: ", result);
        res.send({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

async function updatePet(req, res) {
    try {
        console.log("Now in updatePet: ", req.petId, req.body);
        const { petId } = req.body;
        const pet = req.body;
        if (pet.userId) {
            delete pet.userId;
        }
        if (pet.ownerId === "null") {
            pet.ownerId = null;
        }
        if (req.file) {
            console.log("File path: ", req.file.path);
            pet.picture = req.file.path;
        }
        const updatedPet = await updatePetModel(petId, pet);
        if (!updatedPet) {
            res.status(404).send("Pet not found");
            return;
        }
        console.log("Updated pet: ", updatedPet);
        res.send(updatedPet);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    getAllPets,
    addNewPet,
    getPetById,
    searchPets,
    getPetsByUserId,
    adoptOrFoster,
    returnPet,
    savePet,
    unSavePet,
    getSavedPets,
    deletePet,
    updatePet,
};
