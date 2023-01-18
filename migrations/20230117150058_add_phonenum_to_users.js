exports.up = function (knex) {
    return knex.schema.table("users", (table) => {
        table.string("phone_num", 12);
    });
};

exports.down = function (knex) {
    return knex.schema.table("users", (table) => {
        table.dropColumn("phone_num");
    });
};
