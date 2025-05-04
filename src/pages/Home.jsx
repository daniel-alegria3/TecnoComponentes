import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Simulación de un API local (puede ser reemplazado por fetch a una API real)
    const fetchProductos = async () => {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              nombre: "AMD Ryzen™ 8000G",
              descripcion:
                "Procesador de última generación con gráficos integrados de alto rendimiento",
              precioOriginal: 329.99,
              precio: 299.99,
              estrellas: 4.5,
              reviews: 42,
              etiqueta: "Nuevo",
              imagen: "ruta/amd-ryzen.png",
            },
            {
              id: 2,
              nombre: "NVIDIA RTX 4090",
              descripcion:
                "Tarjeta gráfica de alto rendimiento para gaming y diseño profesional",
              precio: 1599.99,
              estrellas: 5,
              reviews: 87,
              etiqueta: "En Stock",
              imagen: "ruta/rtx-4090.png",
            },
            {
              id: 3,
              nombre: "Samsung SSD 1TB",
              descripcion:
                "Unidad de estado sólido de alta velocidad y capacidad para una experiencia fluida",
              precioOriginal: 129.99,
              precio: 99.99,
              estrellas: 4.7,
              reviews: 124,
              etiqueta: "Oferta",
              imagen: "ruta/samsung-ssd.png",
            },
            {
              id: 4,
              nombre: "Corsair Mechanical Keyboard",
              descripcion:
                "Teclado mecánico para gaming con retroiluminación RGB personalizable",
              precio: 149.99,
              estrellas: 4.6,
              reviews: 99,
              imagen: "ruta/corsair-keyboard.png",
            },
          ]);
        }, 1000); // Simula un delay de 1 segundo
      });

      setProductos(response);
    };

    fetchProductos();
  }, []);

  return (
    <div className="font-monofur">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">TecnoComponentes</h1>
        <input
          type="text"
          placeholder="Buscar componentes, marcas o productos..."
          className="border rounded px-3 py-2 flex-grow md:flex-grow-0 md:w-1/2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Arma tu PC
        </button>
      </header>

      <div className="flex flex-wrap gap-4 px-6 py-4 border-b bg-gray-50">
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          Todas las categorías
        </button>
        <nav className="flex flex-wrap gap-4 text-sm">
          <a href="#">Procesadores</a>
          <a href="#">Tarjetas Gráficas</a>
          <a href="#">Almacenamiento</a>
          <a href="#">Monitores</a>
          <a href="#">Periféricos</a>
        </nav>
      </div>

      <section className="px-6 py-8 bg-blue-100 flex flex-wrap items-center justify-center gap-8">
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Componentes de Alta Calidad
          </h2>
          <p className="mb-4">
            Encuentra las mejores piezas para construir o actualizar tu PC.
            Precios increíbles y envío rápido.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Ver Ofertas
          </button>
        </div>
        <img
          src="ruta/pc-hero.png"
          alt="PC armado"
          className="w-72 md:w-96 rounded shadow-lg"
        />
      </section>

      <section className="px-6 py-8">
        <h3 className="text-2xl font-semibold mb-4">Productos Destacados</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <li
              key={producto.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{producto.nombre}</h4>
                  {producto.etiqueta && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      {producto.etiqueta}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {producto.descripcion}
                </p>
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  {"★".repeat(Math.round(producto.estrellas))}
                  <span className="text-gray-500 text-xs">
                    ({producto.reviews})
                  </span>
                </div>
                <div className="mb-2">
                  {producto.precioOriginal && (
                    <span className="line-through text-gray-400 text-sm mr-2">
                      ${producto.precioOriginal}
                    </span>
                  )}
                  <span className="text-xl font-bold text-blue-600">
                    ${producto.precio.toFixed(2)}
                  </span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 w-full rounded">
                  Añadir al carrito
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Arma Tu PC</h2>
          <p className="text-gray-600 mb-4">
            Configura tu equipo ideal con nuestro asistente. Selecciona
            componentes compatibles y optimiza tu presupuesto.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Comenzar a Armar
          </a>
        </div>
        <div className="flex-1">
          <img
            src="/images/armatu-pc.png"
            alt="Componentes de PC"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </section>
    </div>
  );
}
