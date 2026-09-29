import {useState} from 'react'
import './auth.form.scss'
import { Link,useNavigate} from 'react-router'
import {useAuthUser} from '../hooks/authUser'

function Register() {
  const {loading,handleRegister} = useAuthUser()
 const [email,setEmail] = useState("")
 const [userName,setUserName] = useState("")
 const [password,setPassword] = useState("")
const navigate = useNavigate()

  const handleSubmit = async (e)=>{
  e.preventDefault()
  await handleRegister({email,userName,password})
  navigate('/')
}
  if(loading){
  return <main className='auth-page'>Loading....</main>
  }
  return  (
  <main className='auth-page'>
      <div className='form-contaner'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} >
          <div className='input-group'>
            <label htmlFor="email">Email</label>
            <input
            onChange={(e)=>{setEmail(e.target.value)}}
             type="email" id='email' name='email' />
          </div>
          <div className='input-group'>
            <label htmlFor="userName">user Name</label>
            <input
             onChange={(e)=>{setUserName(e.target.value)}}
              type="text" id='userName' name='userName' />
          </div>
          <div className='input-group'>
            <label htmlFor="password">Password</label>
            <input
             onChange={(e)=>{setPassword(e.target.value)}}
            type="password" id='password' name='password' />
          </div>
          <button className='button primary-button' type='submit'>Register</button>
        </form>
         <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
      </div>
    </main>
  )
}

export default Register