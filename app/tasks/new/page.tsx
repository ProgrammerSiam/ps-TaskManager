"use client";
import { useState } from "react";
import { createTask } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        status: status as any,
        due_date: dueDate,
      });
      router.push("/");
    } catch {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="add-task-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-center min-h-[70vh] px-2"
      >
        <motion.div
          className="w-full max-w-xl px-4 py-8 bg-white border border-gray-100 shadow-xl sm:px-8 dark:bg-gray-900 rounded-2xl dark:border-gray-800"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white">
            Add New Task
          </h1>
          {loading && <Loader />}
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
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                className="w-full px-4 py-2 text-gray-900 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[80px]"
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
            >
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </label>
              <select
                className="w-full px-4 py-2 text-gray-900 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 text-gray-900 transition border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </motion.div>
            {error && (
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
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
                className="w-full py-3 text-lg font-semibold transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
  );
}
