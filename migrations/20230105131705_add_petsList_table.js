exports.up = function (knex) {
    return knex.schema.createTable("usersPetsList", (table) => {
        table.integer("userId").unsigned();
        table.integer("petId").unsigned();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("usersPetsList");
};

// exports.up = function (knex) {
//     return knex.schema.createTable("usersPetsList", (table) => {
//         table.integer("userId").unsigned().references("id").inTable("users");
//         table.integer("petId").unsigned().references("petId").inTable("pets");
//     });
// };

// exports.down = function (knex) {
//     return knex.schema.dropTable("usersPetsList");
// };
