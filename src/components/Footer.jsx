export default function Footer() {
    return (
    <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* TecnoComponentes */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              TecnoComponentes
            </h3>
            <p className="text-sm mb-4">
              Tu tienda especializada en componentes informáticos de alta
              calidad con precios competitivos y envío rápido.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Soporte Técnico
                </a>
              </li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Políticas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Garantía
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <i className="fas fa-map-marker-alt mr-2"></i>Av. Tecnología
                123, Madrid, España
              </li>
              <li>
                <i className="fas fa-phone mr-2"></i>+34 91 123 4567
              </li>
              <li>
                <i className="fas fa-envelope mr-2"></i>
                info@tecnocomponentes.com
              </li>
              <li>
                <i className="fas fa-clock mr-2"></i>Lun - Vie: 9:00 - 20:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          © 2025 TecnoComponentes. Todos los derechos reservados.
          <div className="mt-2 flex justify-center space-x-4 text-gray-400">
            <i className="fab fa-cc-visa text-xl"></i>
            <i className="fab fa-cc-mastercard text-xl"></i>
            <i className="fab fa-cc-paypal text-xl"></i>
            <i className="fab fa-cc-amex text-xl"></i>
          </div>
        </div>
      </footer>
    );
}