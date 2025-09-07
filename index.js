import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 

app.get("/", async (req, res) => {
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return res.send("Error fetching reviews");
  }

  res.render("index", { reviews });
});

app.post("/add", async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.redirect("/");
  }

  const { error } = await supabase.from("reviews").insert([{ content }]);

  if (error) {
    console.error(error.message);
  }

  res.redirect("/");
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
