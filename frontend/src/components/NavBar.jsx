import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        setIsLoggedIn(true);
        setUserName(userData.name);
        setIsAdmin(userData.isAdmin || false);
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      icon: 'info',
      title: 'Cerrar Sesión',
      text: '¿Estás seguro de que quieres cerrar la sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      confirmButtonColor: "#3a043a",
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#000'
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar todos los datos de autenticación
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        setIsLoggedIn(false);
        setUserName('');
        setIsAdmin(false);

        Swal.fire({
          icon: 'success',
          title: 'Sesión Cerrada',
          text: 'Sesión cerrada correctamente',
          confirmButtonColor: "#3a043a",
          background: '#fff',
          color: '#000'
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item"><Link to="/" className="nav__link">Inicio</Link></li>
          </ul>
        </div>
        <div style={{ display: 'flex' }}>
          {isLoggedIn ? (
            <div className="search-box" id="search-box">
              <div className="glyphicon glyphicon-search search-icon">
                <button id="logout" onClick={handleLogout}>
                  <i className="ri-user-6-fill"></i> 
                  {userName} {isAdmin ? '(Admin)' : ''} (Logout)
                </button>
              </div>
            </div>
          ) : (
            <div className="search-box" id="search-box">
              <div className="glyphicon glyphicon-search search-icon">
                <Link to="/login">
                  <button id="logout">
                    <i className="ri-user-6-fill"></i> Login
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;