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
} from "react-icons/fi";
import CountUp from "react-countup";

const STATUS_OPTIONS = ["all", "pending", "completed"] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  console.log(fetchTasks);

  const filteredTasks =
    status === "all" ? tasks : tasks.filter((t) => t.status === status);

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortAsc
      ? a.due_date.localeCompare(b.due_date)
      : b.due_date.localeCompare(a.due_date)
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
    } catch {
      alert("Failed to delete task");
    } finally {
      setDeleting(null);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="max-w-4xl min-h-screen py-12 mx-auto relative bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-white drop-shadow-lg mb-6 font-sans">
          Task Manager Dashboard
        </h1>
        <div className="flex flex-wrap gap-6 items-center bg-blue-900/60 dark:bg-blue-900/80 rounded-xl px-6 py-3 shadow-inner backdrop-blur-sm mb-8 border border-blue-800">
          <span className="text-white/90 text-lg">
            Total:{" "}
            <b className="font-bold">
              <CountUp end={total} duration={0.8} />
            </b>
          </span>
          <span className="text-green-300 text-lg">
            Completed:{" "}
            <b className="font-bold">
              <CountUp end={completed} duration={0.8} />
            </b>
          </span>
          <span className="text-yellow-300 text-lg">
            Pending:{" "}
            <b className="font-bold">
              <CountUp end={pending} duration={0.8} />
            </b>
          </span>
        </div>
      </motion.div>
      <div className="flex flex-wrap gap-0 mb-8 rounded-xl overflow-hidden shadow border border-blue-700 bg-blue-900/40 dark:bg-blue-900/60 w-fit">
        <Button
          type="button"
          className={`px-4 py-2 font-semibold text-base transition-all duration-200 flex items-center gap-1 border-0 rounded-none ${
            sortAsc
              ? "bg-blue-600 text-white shadow"
              : "bg-blue-950/80 text-blue-200 hover:bg-blue-800/80"
          }`}
          onClick={() => setSortAsc((v) => !v)}
        >
          Sort by Due Date: {sortAsc ? "Asc" : "Desc"}
          {sortAsc ? <FiChevronUp /> : <FiChevronDown />}
        </Button>
        {STATUS_OPTIONS.map((opt, idx) => (
          <Button
            key={opt}
            type="button"
            className={`px-4 py-2 font-semibold text-base transition-all duration-200 border-0 rounded-none ${
              status === opt
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-950/80 text-blue-200 hover:bg-blue-800/80"
            } ${idx === STATUS_OPTIONS.length - 1 ? "rounded-r-xl" : ""}`}
            onClick={() => setStatus(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </Button>
        ))}
      </div>
      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <div className="text-red-400 font-semibold text-lg mt-8">{error}</div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {sortedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-6 text-center bg-white/80 rounded-xl shadow-lg text-gray-700 font-semibold">
                  No tasks found.
                </div>
              </motion.div>
            ) : (
              sortedTasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: idx * 0.04,
                  }}
                  whileHover={{
                    scale: 1.025,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  }}
                  className={`bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-3 border border-blue-100 dark:border-gray-800 transition-all duration-300`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-xl font-bold ${
                          task.status === "completed"
                            ? "text-green-700 dark:text-green-400"
                            : "text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-lg text-xs font-semibold tracking-wide ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200"
                        }`}
                      >
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-300 text-base mb-2 line-clamp-2 font-normal">
                      {task.description}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {dayjs(task.due_date).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-2 sm:mt-0">
                    <a
                      href={`/tasks/${task.id}/edit`}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 text-blue-500 dark:text-blue-300 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={20} />
                    </a>
                    <Button
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 bg-transparent border-none"
                      onClick={() => openDeleteModal(task.id)}
                      disabled={deleting === task.id}
                      aria-label="Delete"
                    >
                      <FiTrash2 size={20} />
                    </Button>
                    <a
                      href={`/tasks/${task.id}`}
                      className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-300 font-semibold transition"
                      title="View"
                    >
                      View
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
      <a
        href="/tasks/new"
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-4xl transition-all duration-300 border-4 border-white dark:border-gray-900"
        aria-label="Add Task"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      >
        <FiPlus />
      </a>
      <Modal open={modalOpen} onClose={closeDeleteModal} title="Delete Task?">
        <div className="mb-4 text-gray-800 dark:text-gray-200">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </div>
        <div className="flex gap-4 justify-end">
          <Button
            onClick={closeDeleteModal}
            className="bg-gray-300 text-gray-800 border-none"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting !== null}
            className="bg-red-600"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
