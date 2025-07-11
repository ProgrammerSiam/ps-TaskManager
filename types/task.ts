export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "inprogress";
  due_date: string; // ISO string
}
