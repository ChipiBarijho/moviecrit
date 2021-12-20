import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserModal from './UserModal';
import OutsideClickHandler from 'react-outside-click-handler';


function NavbarAuthed({setOpenNewMovieModal}) {
    const [addMovieSpan, setAddMovieSpan] = useState(false)
    const [openUserModal, setOpenUserModal] = useState(false)
    const [canClick, setCanClick] = useState(true)
    

    const handleUserModal = () =>{
        setOpenUserModal(true)
        setCanClick(false)
    }

    const handleCanClick = () =>{
        setOpenUserModal(false)
        setCanClick(true)
    }
    // If there is a click outside of the modal set canClick to true
    useEffect(() => {
        if (openUserModal === false && canClick === false) {
            setCanClick(true)
        }
        // console.log(openUserModal, canClick, outsideClick);
    }, [openUserModal, canClick])

    return (
        <div className="NavbarAuthed">
            <div className='NavbarAuthed-settings'>
                <div className='NavbarAuthed-settings-addmovie' onClick={() => { setOpenNewMovieModal(true) }} onMouseEnter={() => { setAddMovieSpan(!addMovieSpan) }} onMouseLeave={() => { setAddMovieSpan(!addMovieSpan) }} >
                    <AddIcon className='NavbarAuthed-settings-addicon' />
                    {addMovieSpan ? <span>Add Movie</span> : <></>}
                </div>
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setOpenUserModal(false)
                    }}
                >
                <div className="NavbarAuthed-profile">
                    {/* <AccountCircleIcon className='Navbar-settings-accountcircleicon' onClick={()=>{setOpenUserModal(!openUserModal)}}/> */}
                    <button className='Navbar-settings-accountcircleicon' onClick={canClick ? handleUserModal : handleCanClick}>
                        <AccountCircleIcon />
                    </button>
                    
                    {openUserModal && <UserModal userModal={{openUserModal, setOpenUserModal}} canClick={{canClick, setCanClick}}/>}
                </div>
                </OutsideClickHandler>
            </div>
        </div>
    )
}

export default NavbarAuthed
