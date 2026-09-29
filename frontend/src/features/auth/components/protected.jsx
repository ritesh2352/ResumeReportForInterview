import {useAuthUser} from '../hooks/authUser'
import { Navigate } from 'react-router'

function Protected({children}) {
  const {user,loading} = useAuthUser()

  if(loading){
    return (<main>Loading...</main>)
  }
  if(!user){
   return <Navigate to={'/login'}/>
  }
  return children
}

export default Protected