const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const { checkPetExists, validateBody } = require("../Middleware/petsMiddleware");
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
router.put("/adopt2025/:petId", auth, PetsController.adoptOrFoster2025);

router.put("/adopt/:petId", auth, PetsController.adoptOrFoster);

router.put("/save/:petId/:userId", auth, PetsController.savePet);
router.put("/save2025/:petId", auth, PetsController.savePet2025);

router.put("/unsave/:petId/:userId", auth, PetsController.unSavePet);
router.put("/unsave2025/:petId/", auth, PetsController.unSavePet2025);

router.put("/return/:petId", auth, PetsController.returnPet);

router.get("/myPets/:id", auth, PetsController.getPetsByUserId); // Get pets by user ID
router.get("/myPets2025", auth, PetsController.getPetsByUserId2025); // Get pets by user ID

router.get("/mySavedPets/:id", auth, PetsController.getSavedPets);
router.get("/mySavedPets2025", auth, PetsController.getSavedPets2025);

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

// These routes are redundant. Need to change them. Need to include schema validation in both. Id is not needed
router.put("/updatePet", auth, isAdmin, upload.single("picture"), PetsController.updatePet);
router.put("/updatePetNoPic", validateBody(petSchema), auth, isAdmin, PetsController.updatePet);
router.delete("/:id", auth, isAdmin, PetsController.deletePet);

// These are unsafe routes. Need to change it.
router.get("/:id", PetsController.getPetById);
router.put("/:petId", auth, isAdmin, PetsController.updatePet);

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
