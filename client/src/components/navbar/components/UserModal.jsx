import React, { useContext } from 'react'
// import OutsideClickHandler from 'react-outside-click-handler';
import axios from 'axios'
import { UserContext } from '../../../contexts/UserContext';
import {useNavigate} from 'react-router-dom'
import { ThemeContext } from '../../../contexts/ThemeContext';
function UserModal({userModal, canClick}) {
    const [userContext, setUserContext] = useContext(UserContext)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    let navigate = useNavigate()

    const handleLogout = async () =>{
        const refreshToken = localStorage.getItem('refreshToken')
        const data = {
            "refreshToken":refreshToken
        }
        // const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + '/user/logout', data, {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}})
        const res = await axios.post('/user/logout', data, {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}})
        if (res.status === 200) {
            setUserContext(oldValues =>{
                return {...oldValues, details:undefined, token: null}
            })
            localStorage.removeItem('refreshToken')
        }
        
        window.localStorage.setItem("logout", Date.now())
        window.location.reload(false);
    }

    const handleProfileClick = () =>{
        userModal.setOpenUserModal(false)
        navigate(`/user/${userContext.currentUserId}`)
        
    }


    return (
       
            <div className='UserModal' style={isDarkMode ? {backgroundColor: 'rgb(20, 20, 20)'} : {backgroundColor: 'white'}}>
                <div className="UserModal-options">
                    {/* <Link to={`/user/${userContext.currentUserId}`} onClick={()=>{handleProfileClick()}}>Profile</Link> */}
                    <div onClick={()=>{handleProfileClick()}} style={isDarkMode ? {color:'white'} : {backgroundColor: 'white'}}>Profile</div>
                    {/* <div>Settings</div>
                    <div>Theme</div> */}
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        
    )
}

export default UserModal
