const petSchema = {
    type: "object",
    properties: {
        type: { type: "string" },
        name: { type: "string" },
        adoptionStatus: { type: "string" },
        picture: { type: "string" },
        height: { type: "integer" },
        weight: { type: "integer" },
        color: { type: "string" },
        bio: { type: "string" },
        hypoallergenic: { type: "boolean" },
        dietary: { type: "string" },
        breed: { type: "string" },
        ownerId: {
            oneOf: [{ type: "integer" }, { type: "null" }],
        },
        petId: { type: "integer" },
        created_at: { type: "string" },
    },
    required: ["name", "type", "adoptionStatus"],
    additionalProperties: false,
};

module.exports = { petSchema };
