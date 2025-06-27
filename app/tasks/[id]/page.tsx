"use client";
import React, { useState } from "react";
import { fetchTask, deleteTask } from "../../../lib/api";
import { Task } from "../../../types/task";
import dayjs from "dayjs";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskId, setTaskId] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  }>({ message: "", type: "info", show: false });
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    const loadTask = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setTaskId(id);

        const t = await fetchTask(id);
        if (!t) {
          setError("notfound");
          return;
        }
        setTask(t);
      } catch {
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [params]);

  const openDeleteModal = () => setModalOpen(true);
  const closeDeleteModal = () => setModalOpen(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(taskId);
      setToast({
        message: "Task deleted successfully!",
        type: "success",
        show: true,
      });
      setTimeout(() => router.push("/"), 1200);
    } catch {
      setToast({ message: "Failed to delete task", type: "error", show: true });
    } finally {
      setDeleting(false);
      closeDeleteModal();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-10 animated-gradient-bg">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col gap-8 p-8 border border-blue-100 shadow-lg bg-white/90 rounded-3xl sm:p-10 backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-8 bg-gray-200 rounded-lg" />
            </div>
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
                <div className="w-24 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
                <div className="w-24 h-6 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div>
              <div className="w-24 h-5 mb-2 bg-gray-200 rounded" />
              <div className="bg-gray-100 p-5 rounded-xl border border-blue-100 mb-6 min-h-[80px]">
                <div className="w-3/4 h-5 mb-2 bg-gray-200 rounded" />
                <div className="w-2/3 h-5 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2 sm:flex-row sm:justify-start">
              <div className="w-full h-12 bg-gray-200 sm:w-32 rounded-xl" />
              <div className="w-full h-12 bg-gray-200 sm:w-32 rounded-xl" />
              <div className="w-full h-12 bg-gray-200 sm:w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  if (error === "notfound") return notFound();
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!task)
    return <div className="py-10 text-center text-red-500">Task not found</div>;

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Toast notification */}
      <div className="fixed z-50 bottom-6 right-6">
        <Toast
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      </div>

      {/* Delete confirmation modal */}
      <Modal open={modalOpen} onClose={closeDeleteModal} title="">
        {/* Overlay for blur/focus effect */}
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
        <div className="relative z-50 flex flex-col items-center p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200 rounded-3xl shadow-2xl min-w-[340px] max-w-[95vw] mx-auto animate-fadeIn">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 mb-6 border-4 border-white rounded-full shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="white"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          {/* Title */}
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-center text-blue-700 drop-shadow">
            Delete Task
          </h2>
          {/* Message */}
          <p className="mb-2 text-base font-medium text-center text-gray-700">
            Are you sure you want to delete this task?
          </p>
          <p className="mb-8 text-sm text-center text-gray-500">
            This action cannot be undone.
          </p>
          {/* Buttons */}
          <div className="flex justify-center w-full gap-4">
            <Button
              onClick={closeDeleteModal}
              className="flex-1 py-3 text-lg font-bold text-white transition bg-blue-500 shadow rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              style={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-3 text-lg font-bold text-white transition bg-blue-600 shadow rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              style={{ minWidth: 120 }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        {/* Header with Back Button */}
        <div className="mb-16">
          <Button
            as="a"
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 transition-all duration-200 border border-gray-200 shadow-lg bg-blue-50 backdrop-blur-md rounded-2xl hover:bg-blue-100 hover:shadow-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            asMotion
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
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
            Back to Tasks
          </Button>
        </div>

        <AnimatePresence>
          <motion.div
            key="task-details-wrapper"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Task Header Card */}
            <motion.div
              className="p-8 mb-6 border border-blue-100 shadow-xl bg-white/95 rounded-3xl backdrop-blur-md"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                y: -4,
              }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Title and Icon */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl drop-shadow-lg line-clamp-2">
                        {task.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Created: {dayjs(task.id).format("MMM DD, YYYY")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            Due: {dayjs(task.due_date).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg border-2 transition-all duration-200
                    ${
                      task.status === "completed"
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-200"
                        : "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow-orange-200"
                    }
                  `}
                    tabIndex={0}
                    aria-label={`Status: ${task.status}`}
                  >
                    {task.status === "completed" ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description Card */}
            <motion.div
              className="p-8 mb-8 border border-blue-100 shadow-xl bg-white/95 rounded-3xl backdrop-blur-md"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                y: -2,
              }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-4">
                <h2 className="flex items-center gap-3 mb-2 text-2xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  Description
                </h2>
              </div>
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-blue-100 text-gray-900 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                tabIndex={0}
                aria-label="Task description"
              >
                {task.description || "No description provided."}
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
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
                className="flex-1"
              >
                <Button
                  as="a"
                  href={`/tasks/${taskId}/edit`}
                  className="flex items-center justify-center w-full gap-3 py-4 text-lg font-bold transition-all duration-200 transform shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none hover:scale-105"
                  asMotion
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Edit task"
                >
                  <svg
                    className="w-6 h-6"
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
                  Edit Task
                </Button>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex-1"
              >
                <Button
                  type="button"
                  onClick={openDeleteModal}
                  className="flex items-center justify-center w-full gap-3 py-4 text-lg font-bold transition-all duration-200 transform shadow-lg bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl hover:from-red-600 hover:to-pink-700 hover:shadow-xl focus:ring-2 focus:ring-red-400 focus:outline-none hover:scale-105"
                  disabled={deleting}
                  asMotion
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Delete task"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  {deleting ? "Deleting..." : "Delete Task"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
