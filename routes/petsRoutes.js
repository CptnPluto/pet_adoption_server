const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const {
    checkPetExists,
    validateBody,
} = require("../Middleware/petsMiddleware");
const { upload } = require("../Middleware/imagesMiddleware");
const { auth, isAdmin } = require("../Middleware/usersMiddleware");
const { petSchema } = require("../schemas/petSchema");
const PetsController = require("../controllers/petsController");

router
    .route("/")
    // Get all pets route
    .get(PetsController.getAllPets)
    // Default add pet route
    .put(
        validateBody(petSchema),
        checkPetExists,
        upload.single("picture"),
        PetsController.addNewPet
    );

// Get pets with param route by path param
router.post("/search", PetsController.searchPets);

router.put("/adopt/:petId/:userId/:update", auth, PetsController.adoptOrFoster);
router.put("/save/:petId/:userId", auth, PetsController.savePet);
router.put("/unsave/:petId/:userId", auth, PetsController.unSavePet);
router.put("/return/:petId", auth, PetsController.returnPet);
router.put("/:petId", auth, isAdmin, PetsController.updatePet);

router.get("/:id", PetsController.getPetById);
router.get("/myPets/:id", auth, PetsController.getPetsByUserId); // Get pets by user ID
router.get("/mySavedPets/:id", auth, PetsController.getSavedPets);

router.post(
    "/addPet",
    auth,
    isAdmin,
    upload.single("picture"),
    validateBody(petSchema),
    checkPetExists,
    PetsController.addNewPet
);

router.post(
    "/addPetNoPic",
    validateBody(petSchema),
    auth,
    isAdmin,
    checkPetExists,
    PetsController.addNewPet
);
router.put(
    "/updatePet/:id",
    auth,
    isAdmin,
    upload.single("picture"),
    PetsController.updatePet
);
router.put(
    "/updatePetNoPic/:id",
    validateBody(petSchema),
    auth,
    isAdmin,
    PetsController.updatePet
);
router.delete("/:id", auth, isAdmin, PetsController.deletePet);

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
