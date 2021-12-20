import './Footer.scss'
import {Link} from 'react-router-dom'
import { Facebook, Twitter, Instagram} from '@mui/icons-material'
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
function Footer() {
    return (
        <div className="Footer">
            <div className="Footer-container">
                <div className='Footer-company-name'>
                    <div className='Footer-logo'><Link to='/'>MovieCrit </Link></div>
                    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, odio deleniti labore eveniet provident nobis expedita ab repellendus distinctio quae voluptatum accusantium.</div>
                </div>
                <div className='Footer-socials'>
                    <h3>Socials</h3>
                    <ul>
                        <li><Facebook /></li>
                        <li><Instagram /></li>
                        <li><Twitter /></li>
                    </ul>
                </div>
                <div className="Footer-contact">
                    <h3>Contact</h3>
                    <ul>
                        <li><HomeIcon />  <span>742 Evergreen Terrace</span> </li>
                        <li><EmailIcon /> <span>moviecrit@moviecrit.com</span></li>
                        <li><PhoneIcon />  <span>+ 01 234 567 89</span></li>
                    </ul>
                </div>
            </div>


        </div>
    )
}

export default Footer
