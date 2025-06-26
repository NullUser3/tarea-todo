import { Login } from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Index } from "./components/tasks/Index";
import { TasksPage } from "./components/tasks/TasksPage";
import MainLayout from "./pages/MainLayout";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";
import { AuthProviderWrapper } from "./components/AuthProviderWrapper";
import { TodayTasksPage } from "./components/tasks/TodayTasks";
import { ListTasks } from "./components/sidebar/List/ListTasks";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProviderWrapper />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<Index />}>
            <Route index element={<Navigate to="/allTasks" replace />} />
            <Route path="/allTasks" element={<TasksPage />} />
            <Route path="/today" element={<TodayTasksPage />} />
            <Route path="/lists/:id" element={<ListTasks />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
