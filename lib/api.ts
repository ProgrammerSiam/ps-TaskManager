import { Task } from "../types/task";

const BASE_URL = "https://685bbc9189952852c2dac199.mockapi.io/api/v1/tasks";

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// Fetch a single task
export async function fetchTask(id: string): Promise<Task | null> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
}

// Create a new task
export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// Update an existing task
export async function updateTask(
  id: string,
  task: Omit<Task, "id">
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}
