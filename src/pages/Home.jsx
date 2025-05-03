// Home.jsx
import React from "react";

const products = [
  {
    id: 1,
    name: "Camisa clásica",
    price: "$29.99",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+camisa",
  },
  {
    id: 2,
    name: "Pantalón slim",
    price: "$49.99",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+pantalón",
  },
  {
    id: 3,
    name: "Zapatos de cuero",
    price: "$89.99",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+zapatos",
  },
  {
    id: 4,
    name: "Reloj elegante",
    price: "$120.00",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+reloj",
  },
  {
    id: 5,
    name: "Mochila casual",
    price: "$45.50",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+mochila",
  },
  {
    id: 6,
    name: "Gafas de sol",
    price: "$35.00",
    image: "https://placehold.co/300x200/cccccc/ffffff?text=Imagen+de+gafas",
  },
];

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
        {products.map((product) => (
          <article key={product.id} className="w-full max-w-xs mx-auto">
            <div className="w-full h-48 relative">
              <img
                src={product.image}
                alt={`Imagen de ${product.name}`}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-row justify-between items-start w-full">
                <div className="descripcion">
                  <h6 className="font-medium text-xl leading-8 text-gray-800 mb-2 truncate">
                    {product.name}
                  </h6>
                  <h6 className="font-semibold text-xl leading-8 text-indigo-600">
                    {product.price}
                  </h6>
                </div>
                <div className="agregar-carrito">
                  <button className="p-2 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                    <svg
                      className="stroke-gray-800 transition-all duration-500 group-hover:stroke-black"
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <path
                        d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
