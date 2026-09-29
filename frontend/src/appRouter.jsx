import { createBrowserRouter, Navigate } from "react-router";
import Register from './features/auth/pages/Register'
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home"
import InterviewReport from "./features/interview/pages/InterviewReport";

export const router = createBrowserRouter([
  {path:"/login",element:<Login/>},
  {path:"/register",element:<Register/>},
  {path:"/", element:<Protected><Home></Home></Protected>},
  {path:"/interview-report", element:<Protected><InterviewReport></InterviewReport></Protected>},
  { path: "/interview/:interviewId", element: <Protected><InterviewReport /></Protected> }
]);
