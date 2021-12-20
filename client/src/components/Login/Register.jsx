import './Register.scss'
import React, { useContext, useState } from "react"
import { UserContext } from '../../contexts/UserContext';
import OutsideClickHandler from 'react-outside-click-handler';
import axios from 'axios'
import Loader from "react-loader-spinner";
import { ThemeContext } from '../../contexts/ThemeContext';

function Register({RegisterModal, LoginModal}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [userContext, setUserContext] = useContext(UserContext)
  const {isDarkMode, toggleTheme} = useContext(ThemeContext)

  const handleRegisterForm = e => {
    e.preventDefault()
    const regDetails = {
      "username": username,
      "password": password,
      "email": email,
      "firstName": firstName,
      "lastName": lastName
    }
    setIsSubmitting(true)
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    const postSignUp = async() =>{
      try {
        const res = await axios.post('/user/signup', regDetails)
        if (res.status === 200) {
          setUserContext(oldValues => {
            return { ...oldValues, token: res.data.token }
          })
        } 
      } catch (error) {
        console.log(error.response)
        if (error.response.status === 400) {
          setError('Please fill all the fields correctly')
        } else if (error.response.status === 401) {
          setError('Invalid email and password combination')
        } else if (error.response.status === 409) {
          setError(error.response.data.message)
        } else if (error.response.status === 500) {
          setError(error.response.data.message)
        } else {
          setError(genericErrorMessage)
        }
        setIsSubmitting(false)
      }
      RegisterModal.setOpenRegisterModal(false)
    }
    postSignUp()
    
  }

  return (
    <OutsideClickHandler
        onOutsideClick={() => {
          RegisterModal.setOpenRegisterModal(false)
          LoginModal.setOpenLoginModal(false)
        }}
    >
      <div className={isDarkMode ? "Register Register-dark" : "Register"}>
        <div className={isDarkMode ? "Register-container Register-container-dark": "Register-container"}>
          <h2>Register</h2>
          {error && <p className='Register-error'>{error}</p>}
          <form className={isDarkMode ? 'Register-form Register-form-dark' : 'Register-form'} onSubmit={handleRegisterForm}>
            <label htmlFor="">Email<span className='Register-form-obligatory'>*</span></label>
            <input type="email" name="" id="" onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="">Username<span className='Register-form-obligatory'>*</span></label>
            <input type="text" name="" id="" onChange={e => setUsername(e.target.value)}/>
            <label htmlFor="">Password<span className='Register-form-obligatory'>*</span></label>
            <input type="password" name="" id="" onChange={e => setPassword(e.target.value)}/>
            <label htmlFor="">First Name</label>
            <input type="text" name="" id="" onChange={e => setFirstName(e.target.value)}/>
            <label htmlFor="">Last Name</label>
            <input type="text" name="" id="" onChange={e => setLastName(e.target.value)}/>
            <div className='Register-form-button'>
              <button type="submit" intent='primary' disabled={isSubmitting} className={isSubmitting ? 'Register-form-button-isSubmitting' : ''}>Register</button>
              <div className='Register-form-button-tailspin'>
                {isSubmitting && <Loader type='TailSpin' color='#784BA0' height={22} width={60} />}
              </div>
            </div>
            
          </form>
          <p>Already have an account? <span className='Register-container-login' onClick={() => { LoginModal.setOpenLoginModal(true); RegisterModal.setOpenRegisterModal(false)}}>Sign in</span></p>
        </div>
      </div>
    </OutsideClickHandler>
  )
}

export default Register
