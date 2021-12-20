import './ProfileLeftSide.scss'
import PreviewImage from './PreviewImage';
import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';

function ProfileLeftSide({userData}) {
    const [onPhoto, setOnPhoto] = useState(false)
    const [clickOnPhoto, setClickOnPhoto] = useState(false)
    const params = useParams()
    const [userContext, setUserContext] = useContext(UserContext) 
    return (
        <div className='ProfileLeftSide'>

            {userData && 
            <div className='ProfileLeftSide-user'>
               
                <div className='ProfileLeftSide-photo'>
                    {userContext.currentUserId === params.id && <div className='ProfileLeftSide-photo-container' onMouseEnter={()=>{setOnPhoto(true)}} onMouseLeave={()=>{setOnPhoto(false); setClickOnPhoto(false)}} onClick={()=>{setClickOnPhoto(true)}}>
                            {onPhoto && <div>
                                <div className='ProfileLeftSide-photo-on-upload'></div>
                                <span>Upload Image</span>
                            </div>}
                        
                    </div>}
                    
                    <img src={userData.profileImg} alt="" />
                    
                </div>
                <h1>{userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.username} </h1>
                <div className='ProfileLeftSide-photo-edit'>
                    <PreviewImage clickOnPhoto={clickOnPhoto}/> 
                </div>
            </div>}
           
            
            
        </div>
    )
}

export default ProfileLeftSide
