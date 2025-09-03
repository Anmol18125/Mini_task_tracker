import { Task, CreateTaskDTO, UpdateTaskDTO, FilterParams } from "./types";
import fs from "fs";
import path from "path";

const PERSIST = true; // set to false to disable file persistence
const FILE = path.join(process.cwd(), ".tasks.json");

// Module-scoped in-memory store (resets on server restart)
let tasks: Task[] = [];

function loadFromFile() {
  if (!PERSIST) return;
  try {
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, "utf-8");
      const parsed: Task[] = JSON.parse(raw);
      if (Array.isArray(parsed)) tasks = parsed;
    }
  } catch {
    // ignore on purpose
  }
}

function saveToFile() {
  if (!PERSIST) return;
  try {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
  } catch {
    // ignore on purpose
  }
}

loadFromFile();

function nowISO() {
  return new Date().toISOString();
}

function isReasonableTitle(title: string) {
  return typeof title === "string" && title.trim().length > 0 && title.trim().length <= 120;
}

export const store = {
  list(params: FilterParams = {}): Task[] {
    const status = params.status ?? "all";
    const q = (params.q ?? "").trim().toLowerCase();

    let result = tasks.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (status === "active") result = result.filter(t => !t.done);
    if (status === "completed") result = result.filter(t => t.done);

    if (q) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  },

  create(dto: CreateTaskDTO): Task {
    if (!isReasonableTitle(dto.title)) {
      const err = new Error("Title is required and must be ≤ 120 characters.");
      // @ts-ignore
      err.code = "VALIDATION";
      throw err;
    }
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      description: dto.description?.trim() || undefined,
      done: false,
      createdAt: nowISO()
    };
    tasks.unshift(task);
    saveToFile();
    return task;
  },

  get(id: string): Task | undefined {
    return tasks.find(t => t.id === id);
  },

  update(id: string, patch: UpdateTaskDTO): Task {
    const i = tasks.findIndex(t => t.id === id);
    if (i === -1) {
      const err = new Error("Task not found.");
      // @ts-ignore
      err.code = "NOT_FOUND";
      throw err;
    }
    if (patch.title !== undefined && !isReasonableTitle(patch.title)) {
      const err = new Error("Title must be non-empty and ≤ 120 characters.");
      // @ts-ignore
      err.code = "VALIDATION";
      throw err;
    }

    const old = tasks[i];
    const updated: Task = {
      ...old,
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() : old.title,
      description:
        patch.description !== undefined
          ? (patch.description?.trim() || undefined)
          : old.description
    };
    tasks[i] = updated;
    saveToFile();
    return updated;
  },

  delete(id: string) {
    const i = tasks.findIndex(t => t.id === id);
    if (i === -1) {
      const err = new Error("Task not found.");
      // @ts-ignore
      err.code = "NOT_FOUND";
      throw err;
    }
    tasks.splice(i, 1);
    saveToFile();
  }
};
