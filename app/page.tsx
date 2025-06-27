"use client";
import { useEffect, useState } from "react";
import { fetchTasks, deleteTask } from "../lib/api";
import { Task } from "../types/task";
import dayjs from "dayjs";
import SkeletonTable from "./components/SkeletonTable";
import Button from "./components/Button";
import Modal from "./components/Modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
} from "react-icons/fi";
import React from "react";
import Toast from "./components/Toast";
import Tooltip from "./components/Tooltip";
import SkeletonStats from "./components/SkeletonStats";

const STATUS_OPTIONS = ["all", "pending", "inprogress", "completed"] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

// Pastel background color palette
const PASTEL_COLORS = [
  "bg-blue-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-teal-100",
  "bg-orange-100",
  "bg-indigo-100",
];

function getPastel(index: number) {
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  }>({ message: "", type: "info", show: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  // When status (tab) changes, reset to first page for better UX and animation
  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const filteredTasks =
    status === "all" ? tasks : tasks.filter((t) => t.status === status);

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortAsc
      ? a.due_date.localeCompare(b.due_date)
      : b.due_date.localeCompare(a.due_date)
  );

  const totalPages = Math.ceil(sortedTasks.length / CARDS_PER_PAGE);
  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const openDeleteModal = (id: string) => {
    setToDelete(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setToDelete(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(toDelete);
    try {
      await deleteTask(toDelete);
      setTasks((prev) => prev.filter((t) => t.id !== toDelete));
      closeDeleteModal();
      setToast({
        message: "Task deleted successfully!",
        type: "success",
        show: true,
      });
    } catch {
      setToast({ message: "Failed to delete task", type: "error", show: true });
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
    }, 400); // Simulate loading delay for UX
  };

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
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Dashboard Statistics Section */}
        {loading ? (
          <SkeletonStats />
        ) : (
          !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Tasks */}
                <div className="p-6 border border-blue-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Tasks
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {tasks.length}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="p-6 border shadow-lg bg-white/90 backdrop-blur-md border-emerald-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {
                          tasks.filter((task) => task.status === "completed")
                            .length
                        }
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* In Progress Tasks */}
                <div className="p-6 border border-blue-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        In Progress
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {
                          tasks.filter((task) => task.status === "inprogress")
                            .length
                        }
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pending Tasks */}
                <div className="p-6 border border-orange-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {
                          tasks.filter((task) => task.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {tasks.length > 0 && (
                <div className="p-6 mt-6 border border-blue-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Completion Progress
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      {
                        tasks.filter((task) => task.status === "completed")
                          .length
                      }{" "}
                      of {tasks.length} completed
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className="h-3 transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{
                        width: `${
                          tasks.length > 0
                            ? (tasks.filter(
                                (task) => task.status === "completed"
                              ).length /
                                tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        )}
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-wrap justify-start gap-2 mt-2 md:justify-end md:mt-0">
            <Tooltip content="Sort by Due Date">
              <Button
                type="button"
                className={`px-6 py-2 rounded-full font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center gap-2 shadow-none
                  ${
                    sortAsc
                      ? "text-white bg-blue-600"
                      : "text-gray-500 bg-blue-100 hover:bg-blue-200"
                  }
                `}
                onClick={() => setSortAsc((v) => !v)}
              >
                <span>Sort by Date</span>
                {sortAsc ? (
                  <FiChevronUp size={16} />
                ) : (
                  <FiChevronDown size={16} />
                )}
              </Button>
            </Tooltip>
            {STATUS_OPTIONS.map((opt) => (
              <Tooltip key={opt} content={`Show ${opt} tasks`}>
                <Button
                  type="button"
                  className={`px-6 py-2 rounded-full font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-none
                    ${
                      status === opt
                        ? "bg-blue-600 text-white"
                        : "bg-blue-400 text-gray-500 hover:bg-blue-200"
                    }
                  `}
                  onClick={() => {
                    if (status !== opt) setStatus(opt); // Only update if different
                  }}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Tasks Grid Section */}
        {loading || pageLoading ? (
          <SkeletonTable />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="p-6 border border-red-200 bg-red-50 rounded-2xl">
              <p className="text-lg font-medium text-red-600">{error}</p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              <AnimatePresence mode="wait">
                {paginatedTasks.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-16 text-center col-span-full"
                  >
                    <div className="p-12 bg-white border border-blue-100 shadow-lg rounded-2xl">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                        <FiCalendar className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        No tasks found
                      </h3>
                      <p className="text-gray-600">
                        Create your first task to get started!
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  paginatedTasks.map((task) => {
                    const sortedIdx = sortedTasks.findIndex(
                      (t) => t.id === task.id
                    );
                    return (
                      <motion.div
                        key={task.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className={`relative flex flex-col overflow-hidden transition-all duration-300 border border-blue-100 shadow-lg h-[340px] rounded-3xl hover:shadow-xl ${getPastel( sortedIdx )}`}
                      >
                        {/* Date badge */}
                        <div className="absolute top-6 left-6">
                          <span className="px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-full shadow-sm bg-white/90">
                            {dayjs(task.due_date).format("DD MMM, YYYY")}
                          </span>
                        </div>
                        {/* Card Content */}
                        <div className="flex flex-col justify-between flex-1 pt-20 p-7">
                          {/* Title & Status */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-2xl font-extrabold leading-tight text-gray-900 line-clamp-1">
                                {task.title}
                              </h3>
                              <span
                                className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold align-middle shadow-sm border border-opacity-30
                                  ${
                                    task.status.toLowerCase() === "completed"
                                      ? "bg-emerald-600 text-white border-emerald-700"
                                      : task.status.toLowerCase() === "pending"
                                      ? "bg-orange-500 text-white border-orange-700"
                                      : task.status.toLowerCase() ===
                                        "inprogress"
                                      ? "bg-blue-700 text-white border-blue-900"
                                      : task.status.toLowerCase() === "review"
                                      ? "bg-yellow-300 text-gray-900 border-yellow-400"
                                      : "bg-gray-200 text-gray-800 border-gray-400"
                                  }
                                `}
                                style={{
                                  textShadow: "0 1px 2px rgba(0,0,0,0.18)",
                                  filter:
                                    "drop-shadow(0 1px 2px rgba(0,0,0,0.10))",
                                }}
                              >
                                {task.status.charAt(0).toUpperCase() +
                                  task.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-base text-gray-900 mb-4 line-clamp-2 min-h-[44px]">
                              {task.description}
                            </p>
                          </div>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-full bg-white/80">
                              Due: {dayjs(task.due_date).format("MMM DD")}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-full bg-white/80">
                              ID: {task.id.slice(0, 6)}
                            </span>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t-[1px] border-blue-300/40">
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit Task">
                                <Button
                                  as="a"
                                  href={`/tasks/${task.id}/edit`}
                                  className="flex items-center justify-center px-5 py-2 text-base font-semibold text-white bg-blue-600 rounded-full shadow-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  <FiEdit2 size={18} />
                                </Button>
                              </Tooltip>
                              <Tooltip content="View Task">
                                <Button
                                  as="a"
                                  href={`/tasks/${task.id}`}
                                  className="px-5 py-2 text-base font-semibold text-blue-600 bg-blue-100 border border-blue-100 rounded-full shadow-none hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  View
                                </Button>
                              </Tooltip>
                            </div>
                            <Tooltip content="Delete Task">
                              <Button
                                onClick={() => openDeleteModal(task.id)}
                                disabled={deleting === task.id}
                                className="flex items-center justify-center px-5 py-2 text-base font-semibold text-red-500 bg-red-400 rounded-full shadow-none hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                              >
                                <FiTrash2 size={18} />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-semibold text-blue-600 transition bg-white border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg border font-semibold transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 font-semibold text-blue-600 transition bg-white border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Floating Action Button */}

      <motion.a
        href="/tasks/new"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center justify-center w-16 h-16 text-white transition-all duration-300 border-4 border-white rounded-full shadow-2xl bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-3xl fancy-animate-border"
        aria-label="Add New Task"
      >
        <FiPlus size={24} title="Add New Task" />
      </motion.a>

      {/* Delete Confirmation Modal */}
      <Modal open={modalOpen} onClose={closeDeleteModal} title="">
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />

        <div className="flex relative z-50 flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl min-w-[340px] max-w-[95vw] mx-auto border-2 border-transparent bg-clip-padding animate-fadeIn">
          <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 rounded-full shadow-lg animate-popIn">
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
          <h2 className="mb-3 text-2xl font-bold text-blue-700 drop-shadow">
            Delete Task
          </h2>
          <p className="mb-2 text-base font-medium text-center text-gray-700">
            Are you sure you want to delete this task?
          </p>
          <p className="mb-8 text-sm text-center text-gray-500">
            This action cannot be undone.
          </p>
          <div className="flex justify-center w-full gap-4">
            <Button
              onClick={closeDeleteModal}
              className="py-2 text-lg font-semibold text-blue-700 transition bg-blue-100 border border-blue-200 shadow px-7 rounded-xl hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting !== null}
              className="py-2 text-lg font-semibold text-white transition bg-blue-600 border border-blue-700 shadow px-7 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
