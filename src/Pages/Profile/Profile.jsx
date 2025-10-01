import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";

function Profile() {
  const [profileData, setProfileData] = useState({
    phone: 'Não informado',
    address: 'Não informado',
    city: 'Não informado',
    state: 'Não informado',
    country: 'Não informado',
    zip_code: 'Não informado'
  });
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
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
      
      console.log('🟡 Buscando perfil do usuário ID:', user.id);
      
      // 🔥 PRIMEIRO: Tente a rota específica do usuário logado
      let url = `http://127.0.0.1:8000/api/profile/current`;
      console.log('Tentando URL 1:', url);

      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      let data;

      if (response.ok) {
        data = await response.json();
        console.log('✅ Rota profile/current funcionou!', data);
      } else {
        // 🔥 SEGUNDA OPÇÃO: Se a primeira falhar, tente a rota por user_id
        console.log('❌ Rota profile/current falhou, tentando rota por user_id...');
        url = `http://127.0.0.1:8000/api/profiles/user/${user.id}`;
        console.log('Tentando URL 2:', url);

        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          data = await response.json();
          console.log('✅ Rota profiles/user/{id} funcionou!', data);
        } else {
          // 🔥 TERCEIRA OPÇÃO: Último recurso - buscar todos e filtrar
          console.log('❌ Ambas as rotas falharam, tentando busca geral...');
          url = `http://127.0.0.1:8000/api/profiles`;
          console.log('Tentando URL 3:', url);

          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            data = await response.json();
            console.log('✅ Rota profiles funcionou!', data);
          } else {
            console.log('❌ Todas as rotas falharam');
            setHasProfile(false);
            return;
          }
        }
      }

      console.log('📊 Status final:', response.status);
      console.log('🎯 Dados finais recebidos:', data);

      // PROCESSAMENTO DOS DADOS
      let profile = null;

      if (data.profile) {
        // Formato: { profile: { ... } }
        profile = data.profile;
        console.log('📦 Perfil extraído de data.profile');
      } else if (data.data && Array.isArray(data.data)) {
        // Formato: { data: [{...}] } - buscar pelo user_id
        profile = data.data.find(p => p.user_id == user.id);
        console.log('📦 Perfil filtrado de data.data array');
      } else if (data.data && typeof data.data === 'object') {
        // Formato: { data: {...} }
        profile = data.data.user_id == user.id ? data.data : null;
        console.log('📦 Perfil verificado de data.data objeto');
      } else if (Array.isArray(data)) {
        // Formato: [{...}] - buscar pelo user_id
        profile = data.find(p => p.user_id == user.id);
        console.log('📦 Perfil filtrado de data array');
      } else if (data && typeof data === 'object') {
        // Formato: {...} - verificar se é o perfil correto
        profile = data.user_id == user.id ? data : null;
        console.log('📦 Perfil verificado de data objeto');
      }

      console.log('🔍 Perfil final:', profile);

      if (profile) {
        console.log('✅ PERFIL DO USUÁRIO ENCONTRADO!');
        setProfileData({
          phone: profile.phone || 'Não informado',
          address: profile.address || 'Não informado',
          city: profile.city || 'Não informado',
          state: profile.state || 'Não informado',
          country: profile.country || 'Não informado',
          zip_code: profile.zip_code || 'Não informado'
        });
        setHasProfile(true);
      } else {
        console.log('❌ Nenhum perfil encontrado para o usuário');
        setHasProfile(false);
      }

    } catch (error) {
      console.error('💥 Erro ao carregar perfil:', error);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPersonalInfo = () => {
    navigate('/profile/edit-personal');
  };

  const handleEditContactInfo = () => {
    navigate('/profile/edit-contact');
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
        <div className="profile-container">
          <div className="profile-card">
            <div className="loading-spinner"></div>
            <p>Carregando perfil...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card">
          <h1>Meu Perfil</h1>
          
          {/* Informações básicas do usuário */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Informações Pessoais</h2>
              <button 
                className="edit-btn"
                onClick={handleEditPersonalInfo}
              >
                ✏️ Editar
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nome:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tipo de Usuário:</span>
                <span className="info-value capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Informações de Contato</h2>
              <button 
                className="edit-btn"
                onClick={handleEditContactInfo}
              >
                ✏️ Editar
              </button>
            </div>
            
            {!hasProfile ? (
              <div className="no-profile">
                <p>📝 Você ainda não cadastrou suas informações de contato.</p>
                <button 
                  className="create-profile-btn"
                  onClick={handleEditContactInfo}
                >
                  ➕ Cadastrar Informações de Contato
                </button>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📞 Telefone:</span>
                  <span className="info-value">{profileData.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📍 CEP:</span>
                  <span className="info-value">{profileData.zip_code}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">🏠 Endereço:</span>
                  <span className="info-value">{profileData.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🏙️ Cidade:</span>
                  <span className="info-value">{profileData.city}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🗺️ Estado:</span>
                  <span className="info-value">{profileData.state}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🌎 País:</span>
                  <span className="info-value">{profileData.country}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;