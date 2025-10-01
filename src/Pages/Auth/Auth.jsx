import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Navbar from "../../components/Navbar/Navbar";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client' // Valor padrão
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Substitua esta URL pela URL da sua API Laravel
  const API_URL = 'http://localhost:8000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpa erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = isLogin 
        ? `${API_URL}/api/login` 
        : `${API_URL}/api/register`;

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password,
            role: formData.role // Adiciona o role no payload
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token e dados do usuário
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        console.log(isLogin ? "Login realizado!" : "Cadastro realizado!");
        
        // Força o recarregamento do estado de autenticação na Navbar
        window.dispatchEvent(new Event('storage'));
        
        navigate('/');
      } else {
        // Mostra erro da API
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Erro na autenticação' });
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ general: 'Erro de conexão com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? "Entrar" : "Cadastrar"}</h2>

          {/* Mensagem de erro geral */}
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo de nome (apenas para cadastro) */}
            {!isLogin && (
              <div className="input-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nome completo" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                {errors.name && <span className="error">{errors.name[0]}</span>}
              </div>
            )}

            {/* Campo de e-mail */}
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder="E-mail" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              {errors.email && <span className="error">{errors.email[0]}</span>}
            </div>

            {/* Campo de senha */}
            <div className="input-group">
              <input 
                type="password" 
                name="password"
                placeholder="Senha" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              {errors.password && <span className="error">{errors.password[0]}</span>}
            </div>

            {/* Campo de role (apenas para cadastro) */}
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="role">Tipo de usuário:</label>
                <select 
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="role-select"
                >
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                  {/* Remova a opção super_admin se não for permitido criar via registro */}
                </select>
                {errors.role && <span className="error">{errors.role[0]}</span>}
              </div>
            )}

            <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
              {loading ? "Carregando..." : (isLogin ? "Entrar" : "Cadastrar")}
            </button>
          </form>

          <p className="toggle">
            {isLogin ? (
              <>
                Não tem conta?{" "}
                <span onClick={() => setIsLogin(false)}>Cadastre-se</span>
              </>
            ) : (
              <>
                Já possui conta?{" "}
                <span onClick={() => setIsLogin(true)}>Entrar</span>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Auth;