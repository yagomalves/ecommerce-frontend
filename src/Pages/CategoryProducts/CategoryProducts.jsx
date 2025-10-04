import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./CategoryProducts.css";

function CategoryProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const categoryName = location.state?.categoryName || 'Categoria';

  useEffect(() => {
    fetchCategoryData();
    fetchProducts(1, false);
  }, [categoryId]);

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId}`);
      setCategory(res.data);
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
    }
  };

  const fetchProducts = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/categories/${categoryId}/products?page=${page}&per_page=21`
      );
      
      const productList = res.data.data || [];
      const total = res.data.total || 0;

      console.log(`Página ${page} carregada:`, productList.length, 'produtos');

      // Carrega imagens para os produtos
      const productsWithImages = await Promise.all(
        productList.map(async (product) => {
          try {
            const imgRes = await axios.get(`http://127.0.0.1:8000/api/product-images/${product.id}`);
            return {
              ...product,
              imageUrl: imgRes.data.image_url
            };
          } catch {
            return {
              ...product,
              imageUrl: "https://via.placeholder.com/300x200?text=No+Image"
            };
          }
        })
      );

      if (append) {
        setProducts(prev => [...prev, ...productsWithImages]);
      } else {
        setProducts(productsWithImages);
      }

      // Verifica se tem mais produtos para carregar
      const totalLoaded = append ? products.length + productsWithImages.length : productsWithImages.length;
      setHasMore(totalLoaded < total);

    } catch (error) {
      console.error("Erro ao carregar produtos da categoria:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  const handleBackToCategories = () => {
    navigate('/');
  };

  const handleBrowseAllProducts = () => {
    navigate('/all-products');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="category-products-container">
          <div className="category-loading">
            <div className="loading-spinner"></div>
            <p>Carregando produtos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="category-products-container">
        {/* Cabeçalho da Categoria */}
        <div className="category-header">
          <button className="back-btn" onClick={handleBackToCategories}>
            ← Voltar para o Início
          </button>
          
          <div className="category-info">
            <div className="category-icon-large">
              {getCategoryIcon(categoryName)}
            </div>
            <div>
              <h1>{categoryName}</h1>
              {category?.description && (
                <p className="category-description">{category.description}</p>
              )}
              <p className="products-count">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'} encontrados
              </p>
            </div>
          </div>
        </div>

        {/* Produtos */}
        {products.length === 0 ? (
          <div className="no-products-category">
            <div className="no-products-icon">📦</div>
            <h2>Nenhum produto encontrado nesta categoria</h2>
            <p>Esta categoria ainda não possui produtos cadastrados.</p>
            <div className="no-products-actions">
              <button className="back-categories-btn" onClick={handleBackToCategories}>
                Voltar para Categorias
              </button>
              <button className="browse-all-btn" onClick={handleBrowseAllProducts}>
                Ver Todos os Produtos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="category-products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Botão para carregar mais */}
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Carregando mais produtos...
                    </>
                  ) : (
                    'Carregar Mais Produtos'
                  )}
                </button>
              </div>
            )}

            {/* Mensagem quando todos os produtos foram carregados */}
            {!hasMore && products.length > 0 && (
              <div className="all-loaded">
                <p>🎉 Todos os {products.length} produtos desta categoria foram carregados!</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

// Função de ícones (a mesma do CategoriesBar)
function getCategoryIcon(categoryName) {
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
  if (name.includes('eletro') || name.includes('eletrônico')) return '🔌';
  
  return '📦';
}

export default CategoryProducts;