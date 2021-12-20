import './Navbar.scss'
import NewMovie from '../newMovie/NewMovie';
import { useState, useContext, useEffect, useCallback } from 'react';
import {UserContext} from '../../contexts/UserContext'
import { ThemeContext } from "../../contexts/ThemeContext";
import Login from '../Login/Login';
import Register from '../Login/Register';
import NavbarAuthed from './components/NavbarAuthed';
import axios from 'axios'
import Loader from "react-loader-spinner";
import OutsideClickHandler from 'react-outside-click-handler';
import { Link } from 'react-router-dom';
import { Switch } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchResults from './components/SearchResults';
import {debounce} from '../utils/utils'

function Navbar() {
    const [openNewMovieModal, setOpenNewMovieModal] = useState(false)
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [openRegisterModal, setOpenRegisterModal] = useState(false)
    const [canClick, setCanClick] = useState(true)
    const [isFetching, setIsFetching] = useState(true)
    const [userContext, setUserContext] = useContext(UserContext)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    const [searchValue, setSearchValue] = useState(null)
    const checkUser = useCallback(async () =>{
        const refreshToken = localStorage.getItem('refreshToken')
        if (!userContext.token && !refreshToken) {
            setIsFetching(false)
        }
        const data = {
            "refreshToken":refreshToken
        }
        // const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "/user/refreshToken", data)
        const res = await axios.post("/user/refreshToken", data)
        if (res.status === 200) {
            const token = res.data.token
            setUserContext(oldValues =>{
                return {...oldValues, token: token}
            })
            setIsFetching(false)
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
                localStorage.setItem('refreshToken', res.data.newRefreshToken)
            } else {
                localStorage.removeItem("refreshToken")
                localStorage.setItem('refreshToken', res.data.newRefreshToken)
            }
        } else{
            
            setUserContext(oldValues => {
                return { ...oldValues, token: null }
            })
            setIsFetching(false)
        }
        // call refreshToken every 5 minutes to renew the authentication token.
        setTimeout(checkUser, 5 * 60 * 1000)
    }, [setUserContext])

    useEffect(() => {
        checkUser()
    }, [checkUser])

    const getCurrentUser = useCallback(async ()=>{
        if (userContext.token) {
            const res = await axios.get('/user/userInfo', {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}})
            const currentUserId = res.data._id
            setUserContext(oldValues =>{
                return {...oldValues, currentUserId: currentUserId}
            })
        }
        
    })
    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    useEffect(() => {
        if (openNewMovieModal) {
            document.body.style.overflow = 'hidden';
        } else{
            document.body.style.overflow = 'unset';
        }
        
    }, [openNewMovieModal])

    // Login Modal
    const handleLoginModal = () =>{
        setOpenLoginModal(true)
        setCanClick(false)
    }

    const handleCanClick = () =>{
        setOpenLoginModal(false)
        setCanClick(true)
    }
    // If there is a click outside of the modal set canClick to true
    useEffect(() => {
        if (openLoginModal === false && canClick === false) {
            setCanClick(true)
        }
        // console.log(openLoginModal, canClick);
    }, [openLoginModal, canClick])

    const setTheme = useCallback(()=>{
        const darkMode = localStorage.getItem('isDarkMode')
        if (!darkMode) {
            // localStorage.setItem('isDarkMode', false)
        } else if (darkMode) {
            if (darkMode === 'true') {
                localStorage.setItem('isDarkMode', true)
                toggleTheme(true)
            }
            
        }
        
    })

    useEffect(() => {
        setTheme()
    }, [])

    const handleToggleTheme = () =>{
        
        toggleTheme()
        localStorage.setItem('isDarkMode', !isDarkMode)
    }

    // Scroll position
    // const [prevScrollPos, setPrevScrollPos] = useState(0);
    // const [visible, setVisible] = useState(false);

    // const handleScroll = debounce(() => {
    //     const currentScrollPos = window.pageYOffset;

    //     // setVisible((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70));
    //     if (prevScrollPos && currentScrollPos < 10) {
    //         setVisible(false)
    //     } else if (prevScrollPos > currentScrollPos) {
    //         setVisible(true)
    //     }

    //     setPrevScrollPos(currentScrollPos);
    // }, 100);

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);

    //     return () => window.removeEventListener('scroll', handleScroll);

    // }, [prevScrollPos, visible, handleScroll]);

    return (
        <>
            {/* <div className={isDarkMode ? 'Navbar Navbar-dark' : 'Navbar'} style={{position: visible ? 'absolute' : 'relative'}}> */}
            <div className={isDarkMode ? 'Navbar Navbar-dark' : 'Navbar'}>
                <div className='Navbar-container'>
                    <div className='Navbar-logo'><Link to='/'>MovieCrit </Link></div>
                    <form className='Navbar-search-form'>
                        <input placeholder='Search for a movie...' onChange={(e)=>{setSearchValue(e.target.value)}}/>
                        {/* <input placeholder='Search for a movie...' onChange={(e)=>{findMovie(e)}}/> */}
                        {/* <div className='Navbar-search-icon'>
                            <div>Search</div>
                        </div> */}
                        <OutsideClickHandler
                            onOutsideClick={() => {
                                setSearchValue(null)
                            }}
                        > 
                            <SearchResults searchValue={searchValue} setSearchValue={setSearchValue}/>

                        </OutsideClickHandler>
                    </form>
                    <div className='Navbar-settings'>
                        <div className='Navbar-settings-theme-mode'>
                            {!isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                            <Switch size='small' checked={isDarkMode} onChange={()=>{handleToggleTheme()}}/>
                        </div>
                        
                        {isFetching ? <Loader type='TailSpin' color='white' height={22} width={60} /> :
                            <div>
                               {!userContext.token ?
                               <OutsideClickHandler
                                    onOutsideClick={() => {
                                        setOpenLoginModal(false)
                                    }}
                                > 
                                <div className='Navbar-settings-login'>
                                    {/* <button onClick={() => { setOpenLoginModal(!openLoginModal) }}>Log In</button> */}
                                    <button onClick={canClick ? handleLoginModal : handleCanClick}>Log In</button>
                                    {openLoginModal && <Login LoginModal={{openLoginModal, setOpenLoginModal}} RegisterModal={{openRegisterModal, setOpenRegisterModal}}/>}
                                    {openRegisterModal && <Register LoginModal={{openLoginModal, setOpenLoginModal}} RegisterModal={{openRegisterModal, setOpenRegisterModal}}/>}
                                </div>
                                </OutsideClickHandler>
                            :
                            <NavbarAuthed setOpenNewMovieModal={setOpenNewMovieModal}/>
                            } 
                            </div>
                        }
                        
                    </div>
                </div>
                {openNewMovieModal && <NewMovie setOpenNewMovieModal={setOpenNewMovieModal} />}
            </div>
        </>
    )
}

export default Navbar