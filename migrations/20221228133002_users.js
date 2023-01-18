exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();
            table.string("firstName").notNull();
            table.string("lastName").notNull();
            table.string("email").notNull().unique();
            table.string("password").notNull();
            table.string("bio").defaultTo("");
            table.boolean("admin").defaultTo(false);
            table.string("picture").defaultTo("");
            table.timestamp("created_at").defaultTo(knex.fn.now());
        })
        .createTable("pets", (table) => {
            table.increments("petId").primary();
            table.string("type").notNull();
            table.string("name").notNull();
            table.string("adoptionStatus").notNull().defaultTo("available");
            table
                .string("picture")
                .notNull()
                .defaultTo(
                    "https://images.unsplash.com/photo-1606602842475-a5852a58b399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80"
                );
            table.string("breed").defaultTo("");
            table.float("height").defaultTo(0);
            table.float("weight").defaultTo(0);
            table.string("color").defaultTo("");
            table.text("bio").defaultTo("");
            table.boolean("hypoallergenic").defaultTo(false);
            table.string("dietary").defaultTo("");
            //add a column for ownerId that is an integer and defaults to -1 and is also a foreign key that references the id column in the users table
            table.integer("ownerId").unsigned();
            table.timestamp("created_at").defaultTo(knex.fn.now());
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
