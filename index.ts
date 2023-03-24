import { Client } from "pg";
import { faker } from "@faker-js/faker";
import express from "express";

const app = express();

const client = new Client({ database: "people_act" });
client
  .connect()
  .then(() =>
    client.query(`
    DROP TABLE IF EXISTS person;
    CREATE TABLE person (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      gender VARCHAR(255) NOT NULL,
      favorite_color VARCHAR(255) NOT NULL,
      favorite_food VARCHAR(255) NOT NULL
      );
  `)
  )
  .then(() => console.log("Table created and ready to go!"));

app.set("view engine", "pug");
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.get("/", async (req, res) => {
  await client.query(
    "INSERT INTO person (user_name, gender, favorite_color, favorite_food) VALUES ($1, $2, $3, $4)",
    [
      faker.name.firstName(),
      generateRandomBoolean() ? "Male" : "Female",
      faker.color.human(),
      faker.image.food(),
    ]
  );

  const { rows: people } = await client.query("SELECT * FROM person");
  res.render("index", { people });
});

function generateRandomBoolean() {
  return Math.random() >= 0.5;
}
