"use client";

import { useEffect, useRef, useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: "Low" | "Medium" | "High";
};

const API_URL = "http://localhost:4000"; // Backend URL

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load all tasks from backend
  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const json = await res.json();
      setTasks(json.data);
    } catch (err) {
      console.error("Error loading tasks", err);
    } finally {
      setLoading(false);
    }
  }

  // Add new task
  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          dueDate: due,
          priority
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create task");
      setTasks([json.data, ...tasks]);
      setTitle("");
      setDesc("");
      setDue("");
      setPriority("Medium");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Error creating task", err);
    }
  }

  // Toggle task completion
  async function toggleDone(task: Task) {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update task");
      setTasks(tasks.map(t => (t.id === task.id ? json.data : t)));
    } catch (err) {
      console.error("Error updating task", err);
    }
  }

  // Delete task
  async function deleteTask(id: string) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete task");
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  }

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const completed = tasks.filter(t => t.done).length;
  const active = tasks.length - completed;

  return (
    <div className="grid gap-6">
      <header className="card">
        <h1>👋 Welcome to Task Sheet Bro..</h1>
        <p className="small">
          A simple task manager powered by Next.js (frontend) + Node.js (backend).
        </p>
      </header>

      <section className="card">
        <h2>Create Task</h2>
        <form onSubmit={addTask} className="grid gap-3">
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Short description (optional)"
          />
          <div className="row">
            <label>Due Date:</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} />
          </div>
          <div className="row">
            <label>Priority:</label>
            <select value={priority} onChange={e => setPriority(e.target.value as any)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button>Add Task</button>
        </form>
      </section>

      <section className="card">
        <h2>Your Tasks</h2>
        {loading && <p className="small">Loading tasks…</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet. 🌱 Add one above.</p>}
        {tasks.length > 0 && (
          <ul className="list">
            {tasks.map(t => (
              <li key={t.id} className="item">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t)}
                />
                <div>
                  <h3 style={{ textDecoration: t.done ? "line-through" : "none" }}>
                    {t.title}{" "}
                    {t.priority && <span className="badge">{t.priority}</span>}
                  </h3>
                  {t.description && <p>{t.description}</p>}
                  {t.dueDate && <p className="small">Due: {t.dueDate}</p>}
                  <p className="small">Created: {new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <button className="danger" onClick={() => deleteTask(t.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer small">
        <span>Active: {active} | Completed: {completed}</span>
        {active === 0 && tasks.length > 0 && <span>🎉 You’re all caught up!</span>}
      </footer>
    </div>
  );
}
