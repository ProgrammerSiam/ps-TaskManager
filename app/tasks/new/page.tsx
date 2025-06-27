"use client";
import { useState } from "react";
import { createTask } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import SkeletonForm from "../../components/SkeletonForm";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  }>({ message: "", type: "info", show: false });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createTask({
        title,
        description,
        status: status as "pending" | "completed",
        due_date: dueDate,
      });
      setToast({
        message: "Task added successfully!",
        type: "success",
        show: true,
      });
      setTimeout(() => router.push("/"), 1200);
    } catch {
      setToast({ message: "Failed to add task", type: "error", show: true });
    } finally {
      setLoading(false);
    }
  };

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
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <Button
            as="a"
            href="/"
            className="flex items-center gap-2 px-5 py-2 text-base font-semibold text-gray-800 transition shadow-md bg-blue-50 rounded-xl hover:bg-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            asMotion
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Back to tasks"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
        </div>
        <AnimatePresence>
          <motion.div
            key="add-task-wrapper"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <motion.div
              className="flex flex-col gap-8 p-8 border border-blue-100 shadow-lg bg-white/95 rounded-3xl sm:p-10 backdrop-blur-md"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-center text-gray-900">
                Add New Task
              </h1>
              {loading && <SkeletonForm />}
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
                    disabled={loading}
                    as="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    asMotion
                  >
                    {loading ? "Adding..." : "Add Task"}
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
