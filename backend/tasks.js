let tasks = [];

export function createTask({ title, description, dueDate, priority }) {
  const task = {
    id: Date.now().toString(),
    title,
    description: description || "",
    dueDate: dueDate || null,
    priority: priority || "Medium",
    done: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task);
  return task;
}

export function getTasks() {
  return tasks;
}

export function updateTask(id, patch) {
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return null;
  tasks[i] = { ...tasks[i], ...patch };
  return tasks[i];
}

export function deleteTask(id) {
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return false;
  tasks.splice(i, 1);
  return true;
}
