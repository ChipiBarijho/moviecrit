import './Login.scss'
import React, {useContext, useState} from 'react'
import { UserContext } from '../../contexts/UserContext';
// import OutsideClickHandler from 'react-outside-click-handler';
import axios from 'axios'
import Loader from "react-loader-spinner";
import { ThemeContext } from '../../contexts/ThemeContext';


function Login({ RegisterModal, LoginModal}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userContext, setUserContext] = useContext(UserContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext)

  const handleLoginForm = e => {
    e.preventDefault()
    const loginDetails = {
      "username": username,
      "password": password
    }
    setIsSubmitting(true)
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    const postLogin = async() =>{
      try {
        // const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + '/user/login', loginDetails, {withCredentials: true, credentials: 'include'})
        const res = await axios.post('/user/login', loginDetails, {withCredentials: true, credentials: 'include'})
        if (res.status === 200) {
          setUserContext(oldValues => {
            return { ...oldValues, token: res.data.token }
          })
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken)
          } else{
            localStorage.removeItem("refreshToken")
            localStorage.setItem('refreshToken', res.data.refreshToken)
          }
          
        } 
      } catch (error) {
        setIsSubmitting(false)
        if (error.response.status === 400) {
          setError('Please fill all the fields correctly')
        } else if (error.response.status === 401) {
          setError('Invalid username or password')
        } else {
          setError(genericErrorMessage)
        }
      }
      
    }
    postLogin()
  }


  
  
  return (
    
      <div className={isDarkMode ? "Login Login-dark" : "Login"}>
        <div className={isDarkMode ? "Login-container Login-container-dark": "Login-container"}>
          <h2>Log In</h2>
          {error && <p className='Login-error'>{error}</p>}
          <form className={isDarkMode ? 'Login-form Login-form-dark' : 'Login-form'} onSubmit={handleLoginForm}>
            <label htmlFor="">Username</label>
            <input type="text" name="" id="" onChange={e => setUsername(e.target.value)}/>
            <label htmlFor="">Password</label>
            <input type="password" name="" id="" onChange={e => setPassword(e.target.value)}/>
            <div className='Login-form-button'>
              <button intent='primary' disabled={isSubmitting} type="submit" className={isSubmitting ? 'Login-form-button-isSubmitting' : ''}>Log In</button>
              <div className='Login-form-button-tailspin'>
                {isSubmitting && <Loader type='TailSpin' color='#784BA0' height={22} width={60} />}
              </div>
              
            </div>
            
              
          </form>
          <p>Don't have an account? <span className='Login-container-register' onClick={() => { LoginModal.setOpenLoginModal(false); RegisterModal.setOpenRegisterModal(true)}}>Register</span></p>
        </div>
      </div>
  )
}

export default Login
