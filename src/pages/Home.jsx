import { useState } from "react";
import {
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "../components/ProductCard";

export default function Home() {
  // Lista de productos estática (sin fetch)
  const productos = [
    {
      id: 1,
      name: "AMD Ryzen™ 8000G",
      images_path: [
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
      ],
      brand: "AMD",
      description:
        "Procesador de última generación con gráficos integrados de alto rendimiento",
      price: 299.99,
      stock: 15,
      category: "Procesadores",
    },
    {
      id: 2,
      name: "NVIDIA RTX 4090",
      images_path: [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
      ],
      brand: "NVIDIA",
      description:
        "Tarjeta gráfica de alto rendimiento para gaming y diseño profesional",
      price: 1599.99,
      stock: 3,
      category: "Tarjetas Gráficas",
    },
    {
      id: 3,
      name: "Samsung SSD 1TB 980 PRO",
      images_path: [
        "https://images.unsplash.com/photo-1725085414299-0ce0aebc021a?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1725085815038-279c8139c8a4?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      brand: "Samsung",
      description: "Unidad de estado sólido NVMe de ultra alta velocidad",
      price: 129.99,
      stock: 8,
      category: "Almacenamiento",
    },
    {
      id: 4,
      name: "Corsair K70 RGB Pro",
      images_path: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
      ],
      brand: "Corsair",
      description: "Teclado mecánico para gaming con switches Cherry MX",
      price: 149.99,
      stock: 12,
      category: "Periféricos",
    },
    {
      id: 5,
      name: "Logitech G Pro X Superlight",
      images_path: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500",
      ],
      brand: "Logitech",
      description: "Mouse inalámbrico ultraligero para gaming profesional",
      price: 99.99,
      stock: 0,
      category: "Periféricos",
    },
    {
      id: 6,
      name: "ASUS ROG Swift PG279QM",
      images_path: [
        "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      brand: "ASUS",
      description: 'Monitor gaming 27" QHD 240Hz con tecnología G-SYNC',
      price: 799.99,
      stock: 5,
      category: "Monitores",
    },
    {
      id: 7,
      name: "HyperX Cloud II Wireless",
      images_path: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      ],
      brand: "HyperX",
      description: "Audífonos inalámbricos para gaming con sonido surround 7.1",
      price: 149.99,
      stock: 7,
      category: "Audio",
    },
    {
      id: 8,
      name: "Cooler Master NR200P",
      images_path: [
        "https://images.unsplash.com/photo-1726988372992-cf29696738b4?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      brand: "Cooler Master",
      description:
        "Gabinete mini-ITX compacto con panel lateral de vidrio templado",
      price: 119.99,
      stock: 4,
      category: "Gabinetes",
    },
  ];

  const [search, setSearch] = useState("");

  // Filtrar productos basado en el término de búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const searchTerm = search.toLowerCase();
    return (
      producto.name.toLowerCase().includes(searchTerm) ||
      producto.description.toLowerCase().includes(searchTerm) ||
      producto.brand.toLowerCase().includes(searchTerm) ||
      producto.category.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="font-monofur">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Tecno<span className="text-violet-500">Components</span>
        </h1>

        {/* Contenedor de buscador + botón */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <a
            href="/arma-tu-pc"
            className="bg-gradient-to-r from-violet-600 to-violet-400 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:from-violet-700 hover:to-violet-500 transition-all duration-300"
          >
            <WrenchScrewdriverIcon className="h-5 w-5" />
            Arma tu PC
          </a>
        </div>
      </header>

      {/* Resto del código... */}

      <section className="px-6 py-8">
        <h3 className="text-2xl font-semibold mb-4">Productos</h3>

        {/* Mostrar mensaje si no hay resultados */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </ul>
        )}
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
            src="https://c1.neweggimages.com/productimage/nb1280/A1HJS250227062SB447.jpg"
            height={200}
            width={200}
            alt="Componentes de PC"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </section>
    </div>
  );
}
