import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./CreateProduct.css";

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    status: "active",
  });
  const [images, setImages] = useState([]); // permite múltiplas imagens
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Permitir seleção de até 5 imagens
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setMessage("⚠️ Você só pode selecionar até 5 imagens.");
      return;
    }
    setImages(selectedFiles);
  };

  // Enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setMessage("⚠️ Você precisa estar logado para criar um produto.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // 1️⃣ Criar o produto primeiro
      const productResponse = await axios.post(
        "http://127.0.0.1:8000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const product = productResponse.data;
      console.log("✅ Produto criado:", product);

      // 2️⃣ Enviar as imagens (se houver)
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((img) => {
          imageFormData.append("images[]", img);
        });

        await axios.post(
          `http://127.0.0.1:8000/api/products/${product.id}/images`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📸 Imagens enviadas com sucesso!");
      }

      setMessage("✅ Produto e imagens criados com sucesso!");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category_id: "",
        status: "active",
      });
      setImages([]);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      if (error.response && error.response.data) {
        setMessage(
          "❌ " +
            (error.response.data.message ||
              JSON.stringify(error.response.data.errors) ||
              "Falha ao criar o produto.")
        );
      } else {
        setMessage("❌ Falha ao criar o produto. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      <Navbar />

      <div className="create-product-container">
        <h1>Criar Novo Produto</h1>

        <form onSubmit={handleSubmit} className="create-product-form">
          <label>Nome do Produto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label>Preço (R$)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />

          <label>Quantidade em Estoque</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />

          <label>Categoria (ID)</label>
          <input
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          />

          <label>Imagens (até 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Produto"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      <Footer />
    </div>
  );
}

export default CreateProduct;
