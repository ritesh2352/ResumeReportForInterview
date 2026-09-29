import axios from 'axios'

const api=axios.create({
  baseURL:'http://localhost:3000',
  withCredentials:true,
})



export async function register({email,userName,password}) {

  try{
 const response =await api.post('/api/auth/register',{email,userName,password},
    {withCredentials:true}
  )
  return response.data
}
catch(error){
  console.log(error)
}

}

export async function login({email,password}) {
  try{
    const response=await api.post('/api/auth/login',{email,password}
    )
    return response.data
  }
  catch(error){
    console.log(error)
  }
}

export async function logout() {
  try{
    const response=await api.get('/api/auth/logout')
    return response.data
  }
  catch(error){
    console.log(error)
  }
}

export async function getMe(){
  try{
    const  response=await api.get('/api/auth/get-me')
    return response.data
  }
  catch(error){
    console.log(error)
  }
}