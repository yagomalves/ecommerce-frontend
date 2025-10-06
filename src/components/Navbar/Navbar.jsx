import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const isAuthPage = location.pathname === "/auth";
  const isProfilePage = location.pathname === "/profile";

  // Verifica se o usuário está logado ao carregar o componente
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    // Remove os dados do localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Atualiza o estado
    setIsLoggedIn(false);
    setUser(null);

    // Redireciona para a página inicial
    navigate("/");

    console.log("Logout realizado com sucesso!");
  };

  return (
    <nav className={`navbar ${isAuthPage ? "auth-navbar" : ""}`}>
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">Yago Market</Link>
      </div>

      {/* Centro - Campo de pesquisa */}
      {!isAuthPage && (
        <div className="navbar-search">
          <input type="text" placeholder="Pesquisar produtos..." />
          <button>Buscar</button>
        </div>
      )}

      {/* Direita - Login/Cadastro ou Perfil/Logout */}
      {!isAuthPage && (
        <div className="navbar-user">
          {isLoggedIn ? (
            <div className="navbar-user-menu">
              <span className="welcome-message">
                Olá, {user?.name || "Usuário"}!
              </span>

              {/* Ícone do Carrinho */}
              <div className="cart-icon" onClick={handleCartClick}>
                🛒
              </div>

              {/* Mostra o botão Perfil apenas se NÃO estiver na página de perfil */}
              {!isProfilePage && (
                <Link to="/profile" className="profile-link">
                  Perfil
                </Link>
              )}

              <button onClick={handleLogout} className="logout-btn">
                Sair
              </button>
            </div>
          ) : (
            <Link to="/auth" className="auth-link">
              Login / Cadastro
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
