import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoriesBar.css";

function CategoriesBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/categories");
        // Pega apenas as primeiras 10 categorias
        const topCategories = res.data.data.slice(0, 10);
        setCategories(topCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    // Navega para a página de produtos filtrada por categoria
    navigate(`/products?category=${categoryId}`);
    // Ou se preferir uma rota específica: navigate(`/categories/${categoryId}/products`);
    console.log(`Categoria clicada: ${categoryName}`);
  };

  if (loading) {
    return (
      <div className="categories-bar loading">
        <div className="loading-text">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="categories-bar">
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id, category.name)}
          >
            <div className="category-icon">
              {getCategoryIcon(category.name)}
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Função para retornar ícones baseados no nome da categoria
function getCategoryIcon(categoryName) {
  const icons = {
    // Tecnologia
    'Smartphones': '📱',
    'Computadores': '💻',
    'Eletrônicos': '🔌',
    'Tablets': '📟',
    'Games': '🎮',
    
    // Moda
    'Roupas': '👕',
    'Calçados': '👟',
    'Acessórios': '👓',
    
    // Casa
    'Casa': '🏠',
    'Decoração': '🖼️',
    'Móveis': '🛋️',
    
    // Esportes
    'Esportes': '⚽',
    'Fitness': '💪',
    
    // Beleza
    'Beleza': '💄',
    'Cosméticos': '🧴',
    
    // Livros
    'Livros': '📚',
    'Educação': '🎓',
    
    // Default
    'default': '📦'
  };

  // Procura por palavras-chave no nome da categoria
  const name = categoryName.toLowerCase();
  if (name.includes('phone') || name.includes('celular')) return '📱';
  if (name.includes('computador') || name.includes('laptop')) return '💻';
  if (name.includes('tablet')) return '📟';
  if (name.includes('game') || name.includes('console')) return '🎮';
  if (name.includes('roupa') || name.includes('vestuário')) return '👕';
  if (name.includes('calçado') || name.includes('sapato')) return '👟';
  if (name.includes('casa') || name.includes('lar')) return '🏠';
  if (name.includes('decor') || name.includes('decoração')) return '🖼️';
  if (name.includes('móvel') || name.includes('moveis')) return '🛋️';
  if (name.includes('esporte')) return '⚽';
  if (name.includes('fitness') || name.includes('academia')) return '💪';
  if (name.includes('beleza') || name.includes('cosmético')) return '💄';
  if (name.includes('livro') || name.includes('leitura')) return '📚';
  
  return icons[categoryName] || icons.default;
}

export default CategoriesBar;