import { RouterProvider } from "react-router"
import {router} from "./appRouter"
import { AuthProvider } from "./features/auth/authContext"
import { InterviewProvider } from "./features/interview/interviewContext"
function App() {

  return (
    <>
    <AuthProvider>
      <InterviewProvider>
   <RouterProvider router={router}/>
   </InterviewProvider>
   </AuthProvider>
    </>
  )
}

export default App
