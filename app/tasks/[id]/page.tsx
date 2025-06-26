"use client";
import React, { useState } from "react";
import { fetchTask, deleteTask } from "../../../lib/api";
import dayjs from "dayjs";
import { notFound, useRouter } from "next/navigation";
import Loader from "../../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchTask(params.id)
      .then((t) => {
        if (!t) return setError("notfound");
        setTask(t);
      })
      .catch(() => setError("Failed to load task"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setDeleting(true);
    try {
      await deleteTask(params.id);
      router.push("/");
    } catch {
      setError("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;
  if (error === "notfound") return notFound();
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <AnimatePresence>
      <motion.div
        key="task-details-wrapper"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-center min-h-[70vh] px-2"
      >
        <motion.div
          className="w-full max-w-xl py-10 px-4 sm:px-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            y: -4,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center drop-shadow-lg">
            <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              {task.title}
            </span>
          </h1>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-3 justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Status:
              </span>
              <motion.span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-yellow-300 bg-yellow-200 text-yellow-900 transition-colors duration-200 ${
                  task.status === "completed"
                    ? "!bg-green-200 !text-green-800 !border-green-300"
                    : ""
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                tabIndex={0}
                aria-label={`Status: ${task.status}`}
              >
                {task.status === "completed" ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                )}
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </motion.span>
            </motion.div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Due Date:
              </span>{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {dayjs(task.due_date).format("YYYY-MM-DD")}
              </span>
            </div>
          </div>
          <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Description:
          </div>
          <motion.div
            className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-8 text-gray-900 dark:text-gray-100 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            tabIndex={0}
            aria-label="Task description"
          >
            {task.description}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                as="a"
                href={`/tasks/${task.id}/edit`}
                className="w-full sm:w-auto py-3 text-lg font-semibold rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition flex items-center justify-center gap-2"
                asMotion
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Edit task"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z"
                  />
                </svg>
                Edit
              </Button>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                type="button"
                onClick={handleDelete}
                className="w-full sm:w-auto py-3 text-lg font-semibold rounded-lg shadow-md bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition flex items-center justify-center gap-2"
                disabled={deleting}
                asMotion
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Delete task"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                as="a"
                href="/"
                className="w-full sm:w-auto py-3 text-lg font-semibold rounded-lg shadow-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none transition flex items-center justify-center gap-2"
                asMotion
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Back to tasks"
              >
                <svg
                  className="w-5 h-5"
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
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
