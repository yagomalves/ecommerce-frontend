import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Nome */}
      <div className="footer-name">Yago de Melo Alves</div>

      {/* Blocos de redes sociais e contato */}
      <div className="footer-content">
        {/* Redes Sociais */}
        <div className="footer-block">
          <h4>Redes Sociais</h4>
          <ul>
            <li><a href="https://github.com/yagomalves" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/yagomalves" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="https://instagram.com/hartz_yy" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>

        {/* Contato */}
        <div className="footer-block">
          <h4>Contato</h4>
          <ul>
            <li>Email: <a href="mailto:yago.melo@souunit.com.br">yago.melo@souunit.com.br</a></li>
            <li>WhatsApp: <a href="https://wa.me/5579988920220" target="_blank" rel="noreferrer">(79) 98892-0220</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
