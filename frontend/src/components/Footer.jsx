
function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-bottom">
          <ul className="social-list">
            <li>
              <a href="#" className="social-link">
                <i className="ri-facebook-box-line"></i>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <i className="ri-instagram-line"></i>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <i className="ri-twitter-x-line"></i>
              </a>
            </li>
          </ul>

          <p className="copyright">
            Todos los derechos reservados &copy; 2025 | sitio web creado por <a href="#"> Andrés Felipe Lozada Manzano</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;