# 📋 Task Manager - Modern CRUD Application

A beautiful, modern task management application built with Next.js 15, TypeScript, and Tailwind CSS. Features a responsive design with smooth animations, real-time updates, and an intuitive user interface.

## ✨ Features

### 🎯 Core Functionality

- **Create Tasks**: Add new tasks with title, description, status, and due date
- **Read Tasks**: View all tasks with filtering and sorting options
- **Update Tasks**: Edit existing tasks with form validation
- **Delete Tasks**: Remove tasks with confirmation modal
- **Task Details**: View individual task information

### 🎨 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Toast Notifications**: Real-time feedback for user actions
- **Pagination**: Efficient task browsing with page navigation
- **Search & Filter**: Filter tasks by status (All, Pending, Completed)
- **Sorting**: Sort tasks by due date (ascending/descending)

### 🎨 Visual Design

- **Animated Gradient Background**: Dynamic, eye-catching background animation
- **Pastel Color Palette**: Soft, pleasant color scheme for task cards
- **Modern UI Components**: Custom buttons, modals, tooltips, and forms
- **Glass Morphism**: Backdrop blur effects for modern aesthetics
- **Interactive Elements**: Hover effects and micro-interactions

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router and Turbopack
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions

### UI Libraries

- **React Icons**: Beautiful icon library
- **React Hook Form**: Form handling and validation
- **Date-fns/Day.js**: Date manipulation utilities
- **React CountUp**: Animated number counters

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📁 Project Structure

```
task-manager/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx           # Custom button component
│   │   ├── Modal.tsx            # Confirmation modal
│   │   ├── SkeletonForm.tsx     # Form loading skeleton
│   │   ├── SkeletonTable.tsx    # Table loading skeleton
│   │   ├── Toast.tsx            # Notification component
│   │   └── Tooltip.tsx          # Tooltip component
│   ├── tasks/                   # Task-related pages
│   │   ├── [id]/               # Dynamic task routes
│   │   │   ├── edit/           # Edit task page
│   │   │   └── page.tsx        # Task detail page
│   │   └── new/                # Create new task page
│   ├── globals.css             # Global styles and animations
│   ├── layout.tsx              # Root layout component
│   └── page.tsx                # Dashboard/home page
├── lib/                        # Utility functions
│   └── api.ts                  # API client functions
├── types/                      # TypeScript type definitions
│   └── task.ts                 # Task interface
├── public/                     # Static assets
└── configuration files         # Next.js, Tailwind, ESLint configs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 API Integration

The application integrates with a mock API service for task management:

- **Base URL**: `https://685bbc9189952852c2dac199.mockapi.io/api/v1/tasks`
- **Endpoints**:
  - `GET /tasks` - Fetch all tasks
  - `GET /tasks/:id` - Fetch single task
  - `POST /tasks` - Create new task
  - `PUT /tasks/:id` - Update task
  - `DELETE /tasks/:id` - Delete task

## 🎨 Key Components

### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  due_date: string; // ISO string
}
```

### Features Overview

- **Dashboard**: Main page with task cards, filtering, and pagination
- **Task Creation**: Form-based task creation with validation
- **Task Editing**: Pre-populated form for task updates
- **Task Details**: Individual task view page
- **Responsive Cards**: Beautiful task cards with pastel colors
- **Interactive Modals**: Confirmation dialogs for destructive actions

## 🎯 Key Features in Detail

### Dashboard Features

- **Status Filtering**: Toggle between All, Pending, and Completed tasks
- **Date Sorting**: Sort tasks by due date (ascending/descending)
- **Pagination**: 6 tasks per page with smooth transitions
- **Task Cards**: Colorful cards with hover animations
- **Quick Actions**: Edit and delete buttons on each card

### Form Features

- **Validation**: Required field validation with error messages
- **Date Picker**: Native date input for due dates
- **Status Selection**: Dropdown for task status
- **Loading States**: Skeleton loaders during form submission
- **Success Feedback**: Toast notifications and automatic navigation

### Animation Features

- **Page Transitions**: Smooth page-to-page navigation
- **Card Animations**: Staggered card entrance animations
- **Hover Effects**: Scale and lift effects on interactive elements
- **Loading Animations**: Skeleton loaders with pulse effects
- **Toast Animations**: Slide-in notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
