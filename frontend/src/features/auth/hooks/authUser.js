import {useContext,useEffect} from 'react'
import {AuthContext} from '../authContext.jsx'
import {login,logout,register,getMe} from '../services/authApi.js'

export const useAuthUser=()=>{
  const context = useContext(AuthContext)
  const {user,setUser,loading,setLoading}=context

  const handleLogin= async ({email,password})=>{
    setLoading(true)
    try{
    const data= await login({email,password})
    setUser(data.user)
    }
    catch(error){

    }finally{
      setLoading(false)
    }
  }

const handleRegister = async ({email,userName,password})=>{
  setLoading(true);
  try{
    const data = await register({email,userName,password})
    setUser(data.user)
  }catch(error){
    console.error(error)
  }finally{
    setLoading(false)
  }
}

const handleLogout= async ()=>{
  setLoading(true)
  try{
    await logout()
    setUser(null)
  }catch(error){
    console.error(error)
  }finally{
    setLoading(false)
  }
}

const handleGetMe = async ()=>{
  setLoading(true)
  try{
    const data = await getMe()
    setUser(data.user)
  }catch(error){
    console.error(error)
  }finally{
    setLoading(false)
  }
}
useEffect(()=>{
   const getAndSetUser =async ()=>{
    try{
      const data = await getMe()
     setUser(data.user);
    }catch(error){
     setUser(null)
    }finally{
       setLoading(false)
    }
   }
   getAndSetUser()
 },[])

  return {handleGetMe,handleLogin,handleLogout,handleRegister,user,loading}
}