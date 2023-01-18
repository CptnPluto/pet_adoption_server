require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnection = require("./knex/knex");

const petsRoutes = require("./routes/petsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const { _ } = require("ajv");

//Express automatically detects the content type of the request and parses it into a JSON object
const app = express();
const PORT = process.env.PORT || 8080;

// NOTE: MIDDLEWARE IS EVALUATED IN ORDER THAT IT IS WRITTEN IN THE FILE.

app.use(express.json()); // Replaces default Node body-parser -- IMPORTANT
app.use(cookieParser());
app.use("/images", express.static("images"));
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3000/CptnPluto/pet_adoption_clien",
            "https://pet-adoption-client-bice.vercel.app",
            "https://pet-adoption-client-bice.vercel.app",
        ],
        credentials: true,
    })
);

app.use(morgan("tiny"));

app.use("/pets", petsRoutes);
app.use("/users", usersRoutes);
app.get("*", (req, res) => {
    res.status(404).send("Page not found");
}); 

// Start server with db connection
dbConnection.migrate.latest().then((migration) => {
    if (migration) {
        console.log("Connected to DB", migration);
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    }
});

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });
