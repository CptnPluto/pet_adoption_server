exports.up = function (knex) {
    return knex.schema.createTable("usersPetsList", (table) => {
        table.integer("userId").unsigned().notNullable();
        table.integer("petId").unsigned().notNullable();
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

//migrations unlocked?