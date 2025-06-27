"use client";
import { useEffect, useState } from "react";
import { fetchTask, updateTask } from "../../../../lib/api";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/Button";
import Toast from "../../../components/Toast";

export default function EditTask() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  }>({ message: "", type: "info", show: false });

  useEffect(() => {
    fetchTask(id)
      .then((task) => {
        if (!task) {
          setError("Task not found");
          setLoading(false);
          return;
        }
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setDueDate(task.due_date.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load task");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateTask(id, {
        title,
        description,
        status: status as "pending" | "completed",
        due_date: dueDate,
      });
      setToast({
        message: "Task updated successfully!",
        type: "success",
        show: true,
      });
      setTimeout(() => router.push(`/tasks/${id}`), 1200);
    } catch {
      setToast({ message: "Failed to update task", type: "error", show: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen px-2 py-10 animated-gradient-bg">
        <div className="w-full max-w-xl">
          <div className="flex flex-col gap-8 p-8 border border-blue-100 shadow-lg bg-white/90 rounded-3xl sm:p-10 backdrop-blur-md animate-pulse">
            <div className="w-2/3 h-8 mb-4 bg-gray-200 rounded-lg" />
            <div className="space-y-6">
              <div className="w-1/3 h-5 mb-2 bg-gray-200 rounded" />
              <div className="w-full h-12 mb-4 bg-gray-200 rounded-xl" />
              <div className="w-1/3 h-5 mb-2 bg-gray-200 rounded" />
              <div className="w-full h-20 mb-4 bg-gray-200 rounded-xl" />
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="w-1/2 h-5 mb-2 bg-gray-200 rounded" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="w-1/2 h-5 mb-2 bg-gray-200 rounded" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
              <div className="w-full h-12 mt-6 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen px-2 py-10 animated-gradient-bg">
      {/* Toast notification */}
      <div className="fixed z-50 bottom-6 right-6">
        <Toast
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      </div>

      <div className="w-full max-w-xl">
        <AnimatePresence>
          <motion.div
            key="edit-task-wrapper"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            <motion.div
              className="flex flex-col gap-8 p-8 border border-blue-100 shadow-lg bg-white/95 rounded-3xl sm:p-10 backdrop-blur-md"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-center text-gray-900">
                Edit Task
              </h1>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08 },
                  },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <input
                    className="w-full px-4 py-3 text-base font-medium text-gray-900 border border-blue-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Task title"
                  />
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium min-h-[80px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Task description"
                  />
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-3 text-base font-medium text-gray-900 border border-blue-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 text-base font-medium text-gray-900 border border-blue-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
                {error && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.div>
                )}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold transition bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={saving}
                    as="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    asMotion
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
