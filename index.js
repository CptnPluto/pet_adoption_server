// require("dotenv").config();
// const { _ } = require("ajv"); // Ensure AJV is up-to-date
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnection = require("./knex/knex");

const petsRoutes = require("./routes/petsRoutes");
const usersRoutes = require("./routes/usersRoutes");

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
			"https://pet-adoption-server-two.vercel.app",
			"https://pet-adoption-client-bswe6zbeo-cptnpluto.vercel.app",
		],
		credentials: true,
	})
); // Regularly review and update the list of allowed origins

app.use(morgan("tiny"));

app.use("/pets", petsRoutes);
app.use("/users", usersRoutes);

// route to get return all the info in the pets and users table
app.get("/dump-all", async (req, res) => {
    try {
      // 1) Get all table names. For MySQL-compatible PlanetScale, `SHOW TABLES` works.
      //    Ensure your Knex config sets the default database or replace with:
      //    `SHOW TABLES FROM \`${process.env.DB_NAME}\`` if needed.
      const [rows] = await dbConnection.raw("SHOW TABLES");
  
      // 2) Parse the list of tables from the row structure: { 'Tables_in_<dbname>': 'tableName' }
      const tableNames = rows.map((row) => {
        const key = Object.keys(row)[0];
        return row[key]; // e.g. "users", "pets", etc.
      });
  
      // 3) For each table, fetch all rows
      const data = {};
      for (const table of tableNames) {
        data[table] = await dbConnection(table).select("*");
      }
  
      // 4) Return combined result
      return res.json(data);
    } catch (err) {
      console.error("Error dumping all data:", err);
      return res.status(500).json({ error: "Failed to retrieve data" });
    }
  });

app.all("*", (req, res) => {
	res.status(404).send("Page not found. WHAT ARe YOU DOING?");
});

// Start server with db connection
dbConnection.migrate
	.latest()
	.then((migration) => {
		if (migration) {
			console.log("Connected to DB", migration);
			app.listen(PORT, () => {
				console.log(`Server listening on ${PORT}`);
			});
		}
	})
	.catch((err) => {
		console.error("Failed to connect to DB", err);
		process.exit(1);
	}); // Ensure migrations are up-to-date and handle errors properly
