import {Link, withRouter} from 'react-router-dom'
// import {IoMdHome} from 'react-icons/io'
// import {BsBriefcaseFill} from 'react-icons/bs'
// import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

// <div className="nav-menu-mobile">
//   <ul className="nav-menu-list-mobile">
//     <Link to="/">
//       <li className="nav-menu-item-mobile" aria-label="home page">
//         <IoMdHome />
//       </li>
//     </Link>
//     <Link to="/jobs">
//       <li className="nav-menu-item-mobile" aria-label="jobs page">
//         <BsBriefcaseFill />
//       </li>
//     </Link>
//     <li className="nav-menu-item-mobile">
//       <button
//         type="button"
//         className="logout-mobile-btn"
//         onClick={onClickLogout}
//         aria-label="logout"
//       >
//         <FiLogOut />
//       </button>
//     </li>
//   </ul>
// </div>

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>Jobs</li>
          </Link>
          <li>
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
