import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileLeftSide from './components/ProfileLeftSide'
import ProfileRightSide from './components/ProfileRightSide'
import axios from 'axios'
import './Profile.scss'
import { ThemeContext } from '../../contexts/ThemeContext'

function Profile() {
    const [userData, setUserData] = useState(null)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    const params = useParams() 
    let navigate = useNavigate()

    useEffect(() => {
        const getProfile = async () =>{
            
            const res = await axios.get(`/user/${params.id}`,)
            if (res.status === 200) {
                setUserData(res.data)
            } else if (res.status === 404){
                navigate('/404')
            }
        }

        getProfile()
        
    }, [params])

    return (
        <div className={isDarkMode ? 'bg-dark' : ''}>
            <div className="Profile">
                <ProfileLeftSide userData={userData}/>
                <ProfileRightSide userData={userData} isDarkMode={isDarkMode}/>
            </div>
        </div>
        
    )
}

export default Profile
