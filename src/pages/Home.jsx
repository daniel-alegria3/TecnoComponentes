import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await fetch(
          "http://localhost:5000/api/clients/getproducts"
        );

        if (!productsResponse.ok) {
          const errorText = await productsResponse.text();
          throw new Error(`Error ${productsResponse.status}: ${errorText}`);
        }

        const productsData = await productsResponse.json();

        setProductos(productsData);
      } catch (err) {
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);
  const [search, setSearch] = useState("");

  const productosFiltrados = productos.filter((producto) => {
    const searchTerm = search.toLowerCase();
    return (
      producto.name.toLowerCase().includes(searchTerm) ||
      producto.description.toLowerCase().includes(searchTerm) ||
      producto.brand.toLowerCase().includes(searchTerm) ||
      producto.category.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="font-monofur">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Tecno<span className="text-violet-500">Components</span>
        </h1>


        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
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

      <section className="px-6 py-8 flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold mb-4">Productos</h3>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <ul className="flex flex-wrap w-full justify-center md:justify-start gap-4 align-items-center">
            {productosFiltrados.map((producto) => {
              return (
                <ProductCard
                  key={producto.id_product}
                  producto={producto}
                />
              );
            })}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-6 flex items-center justify-between gap-4 mx-6 mb-8 h-150">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Arma Tu PC</h2>
          <p className="text-gray-600 mb-4">
            Configura tu equipo ideal con nuestro asistente.
          </p>
          <a
            href="#"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Comenzar a Armar
          </a>
        </div>
        <div className="flex-1 h-1/2 w-1/2">
          <img
            src="https://c1.neweggimages.com/productimage/nb1280/A1HJS250227062SB447.jpg"
            alt="Componentes de PC"
            className="w-auto h-auto rounded-lg object-cover"
          />
        </div>
      </section>
    </div>
  );
}
