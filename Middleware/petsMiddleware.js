const Ajv = require("ajv");
const dbConnection = require("../knex/knex");
const { doesPetExistModel } = require("../Models/petsModel");

// Import AJV validation - https://ajv.js.org/
const ajv = new Ajv();

async function checkPetExists(req, res, next) {
    const { name } = req.body;
    console.log("name: ", name);
    const pet = await dbConnection
        .select("*")
        .from("pets")
        .where({ name: name });
    console.log("pet: ", pet);
    if (pet.length > 0) {
        res.status(400).send("A pet already exists with this name.");
        // Return in the if statement - otherwise it might go to next() (weirdly)
        return;
    }

    next();
}

function validateBody(schema) {
    return (req, res, next) => {
        // const data = { foo: 1, bar: "abc" };
        console.log("in validateBody: ", req.body);
        req.body.height = Number(req.body.height);
        req.body.weight = Number(req.body.weight);
        req.body.hypoallergenic = req.body.hypoallergenic === "true";
        console.log("Still in validateBody: ", req.body);

        const valid = ajv.validate(schema, req.body);
        if (!valid) {
            console.log("ajv.errors: ", ajv.errors);
            res.status(400).send(ajv.errors);
            return;
        }
        next();
    };
}

module.exports = { checkPetExists, validateBody };
