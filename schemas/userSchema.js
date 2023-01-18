const userSchema = {
    type: "object",
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
    },
    required: ["firstName", "lastName", "email", "password"],
    additionalProperties: false,
};

module.exports = { userSchema };
