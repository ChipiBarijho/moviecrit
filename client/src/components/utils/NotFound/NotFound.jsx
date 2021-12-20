import './NotFound.scss'
import {useContext} from 'react'
import {ThemeContext} from '../../../contexts/ThemeContext'

function NotFound() {
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    return (
        <div className={isDarkMode ? 'NotFound NotFound-dark' : 'NotFound'}>
            <h1>404</h1>
            <h3>Not Found</h3>
            <div>The page requested could not be found</div>
        </div>
    )
}

export default NotFound
