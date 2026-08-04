import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>ObjectifPlus</Link>
        <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '8px' }}>
          v{process.env.REACT_APP_VERSION || 'dev'}
        </span>
      </div>
      <ul>
        {user ? (
          <li>
            <button className='btn' onClick={onLogout}>
              <FaSignOutAlt /> Se déconnecter
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Se connecter
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> S'inscrire
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header