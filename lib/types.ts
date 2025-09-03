export type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string; // ISO string
};

export type CreateTaskDTO = {
  title: string;
  description?: string;
};

export type UpdateTaskDTO = Partial<Pick<Task, "title" | "description" | "done">>;

export type FilterParams = {
  status?: "all" | "active" | "completed";
  q?: string;
};
