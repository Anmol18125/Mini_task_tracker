import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createTask, getTasks, updateTask, deleteTask } from "./tasks.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", (req, res) => {
  res.json({ data: getTasks() });
});

app.post("/tasks", (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = createTask({ title, description, dueDate, priority });
  res.status(201).json({ data: task });
});

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const updated = updateTask(id, req.body);
  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json({ data: updated });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const ok = deleteTask(id);
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

