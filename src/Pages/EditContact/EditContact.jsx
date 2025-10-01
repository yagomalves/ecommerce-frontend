import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./EditContact.css";

function EditContact() {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Carrega os dados do perfil ao montar o componente
  useEffect(() => {
    if (user.id) {
      fetchProfileData();
    }
  }, [user.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      console.log('Carregando dados de contato...');

      // Tenta diferentes URLs para buscar o perfil
      const urlsToTry = [
        `http://127.0.0.1:8000/api/profile/current`,
        `http://127.0.0.1:8000/api/profiles/user/${user.id}`,
        `http://127.0.0.1:8000/api/profiles`
      ];

      let response = null;
      let data = null;

      for (const url of urlsToTry) {
        try {
          console.log('Tentando URL:', url);
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            data = await response.json();
            console.log('Dados recebidos:', data);
            break;
          }
        } catch (err) {
          console.log('URL falhou:', url);
          continue;
        }
      }

      if (response && response.ok) {
        let profile = null;
        
        // Extrai o perfil baseado no formato da resposta
        if (data.profile) {
          profile = data.profile;
        } else if (data.data && Array.isArray(data.data)) {
          profile = data.data.find(p => p.user_id == user.id);
        } else if (data.data && typeof data.data === 'object') {
          profile = data.data.user_id == user.id ? data.data : null;
        } else if (Array.isArray(data)) {
          profile = data.find(p => p.user_id == user.id);
        }

        if (profile) {
          console.log('Perfil encontrado:', profile);
          setFormData({
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            country: profile.country || '',
            zip_code: profile.zip_code || ''
          });
        } else {
          console.log('Nenhum perfil encontrado, usando valores padrão');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'País é obrigatório';
    }

    if (!formData.zip_code.trim()) {
      newErrors.zip_code = 'CEP é obrigatório';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = 'http://127.0.0.1:8000';

      console.log('Enviando dados:', formData);

      // Tenta criar ou atualizar o perfil
      const response = await fetch(`${API_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        })
      });

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (response.ok) {
        setMessage('Informações de contato salvas com sucesso!');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.message || 'Erro ao salvar informações');
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="edit-contact-container">
          <div className="edit-contact-card">
            <div className="loading-spinner"></div>
            <p>Carregando informações...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="edit-contact-container">
        <div className="edit-contact-card">
          <div className="page-header">
            <button className="back-btn" onClick={handleCancel}>
              ← Voltar
            </button>
            <h1>Editar Informações de Contato</h1>
          </div>

          {/* Mensagem de sucesso/erro */}
          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-section">
              <h2>Informações de Contato</h2>
              <p className="section-description">
                Preencha suas informações de contato para facilitar a comunicação
              </p>
              
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="phone">Telefone *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="zip_code">CEP *</label>
                  <input 
                    type="text" 
                    id="zip_code"
                    name="zip_code"
                    placeholder="00000-000"
                    value={formData.zip_code}
                    onChange={handleChange}
                    className={errors.zip_code ? 'error' : ''}
                  />
                  {errors.zip_code && <span className="error-text">{errors.zip_code}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="address">Endereço Completo *</label>
                <input 
                  type="text" 
                  id="address"
                  name="address"
                  placeholder="Rua, número, bairro"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="city">Cidade *</label>
                  <input 
                    type="text" 
                    id="city"
                    name="city"
                    placeholder="Sua cidade"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="state">Estado *</label>
                  <input 
                    type="text" 
                    id="state"
                    name="state"
                    placeholder="Seu estado"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="country">País *</label>
                <input 
                  type="text" 
                  id="country"
                  name="country"
                  placeholder="Seu país"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
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
                  'Salvar Informações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditContact;