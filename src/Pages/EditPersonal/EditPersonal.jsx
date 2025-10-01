import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./EditPersonal.css";

function EditPersonal() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Carrega os dados do usuário ao montar o componente
  useEffect(() => {
    if (user.id) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpa erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setErrors({});

    // Validações básicas
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validações de senha apenas se alguma senha foi preenchida
    const hasPasswordFields = formData.currentPassword || formData.newPassword || formData.confirmPassword;
    
    if (hasPasswordFields) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória para alterar a senha';
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'A nova senha deve ter pelo menos 6 caracteres';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = 'http://127.0.0.1:8000';

      // Prepara os dados para envio
      const dataToSend = {
        name: formData.name,
        email: formData.email,
      };

      // Adiciona campos de senha apenas se preenchidos
      if (formData.currentPassword) {
        dataToSend.current_password = formData.currentPassword;
        dataToSend.new_password = formData.newPassword;
        dataToSend.new_password_confirmation = formData.confirmPassword;
      }

      console.log('Enviando dados:', dataToSend);

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (response.ok) {
        setMessage('Informações pessoais atualizadas com sucesso!');
        
        // Atualiza o usuário no localStorage
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Limpa os campos de senha
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.message || 'Erro ao atualizar informações');
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro de conexão com o servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  // Se não estiver logado, redireciona para login
  if (!localStorage.getItem('auth_token')) {
    navigate('/auth');
    return null;
  }

  return (
    <>
      <Navbar />
      
      <div className="edit-personal-container">
        <div className="edit-personal-card">
          <div className="page-header">
            <button className="back-btn" onClick={handleCancel}>
              ← Voltar
            </button>
            <h1>Editar Informações Pessoais</h1>
          </div>

          {/* Mensagem de sucesso/erro */}
          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-form">
            {/* Informações Básicas */}
            <div className="form-section">
              <h2>Informações Básicas</h2>
              
              <div className="input-group">
                <label htmlFor="name">Nome Completo *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            {/* Alteração de Senha */}
            <div className="form-section">
              <h2>Alterar Senha</h2>
              <p className="section-description">
                Deixe em branco se não deseja alterar a senha
              </p>
              
              <div className="input-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <input 
                  type="password" 
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Sua senha atual"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={errors.currentPassword ? 'error' : ''}
                />
                {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <input 
                  type="password" 
                  id="newPassword"
                  name="newPassword"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? 'error' : ''}
                />
                {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Digite novamente a nova senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPersonal;