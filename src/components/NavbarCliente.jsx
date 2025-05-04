import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import NavLink from "./NavLink";
import { useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Ofertas", href: "/ofertas" },
  { name: "Ayuda", href: "/ayuda" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo y navegación izquierda */}
              <div className="flex items-center">
                {/* Botón móvil - ahora en el flujo normal */}
                <div className="flex sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                    <span className="sr-only">Abrir menú</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>

                {/* Logo */}
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Logo"
                  />
                </div>

                {/* Navegación desktop */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Elementos del lado derecho */}
              <div className="flex items-center">
                {/* Carrito */}
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none mr-2"
                >
                  <span className="sr-only">Carrito</span>
                  <div className="relative bg-white rounded-full p-1">
                    <svg
                      className="h-6 w-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-xs font-semibold text-white">
                      3
                    </span>
                  </div>
                </button>

                {/* Login/Perfil */}
                {isLoggedIn ? (
                  <Menu as="div" className="relative ml-2">
                    <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Perfil"
                      />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={classNames(
                              focus ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Mi perfil
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={classNames(
                              focus ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Mis pedidos
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <a
                            onClick={handleLogout}
                            className={classNames(
                              focus ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Cerrar sesión
                          </a>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <div
                    className="relative ml-3 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <svg
                      onClick={handleLogin}
                      width="140"
                      height="36"
                      viewBox="0 0 140 36"
                      className="cursor-pointer rounded-full shadow-lg transition-all duration-300 ease-in-out"
                    >
                      {/* Fondo - violeta en móvil, gradiente en desktop */}
                      <rect
                        x="0"
                        y="0"
                        width="140"
                        height="36"
                        rx="18"
                        className="sm:fill-[url(#gradient)] fill-violet-600 group-hover:opacity-90 transition-opacity duration-300"
                      />

                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>

                      {/* Borde - comportamiento diferente en móvil */}
                      <rect
                        x="2"
                        y="2"
                        width="136"
                        height="32"
                        rx="16"
                        stroke="#FFF"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="340"
                        strokeDashoffset={
                          isHovered || window.innerWidth < 640 ? "0" : "340"
                        }
                        style={{
                          transition:
                            "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />

                      {/* Texto - siempre blanco */}
                      <text
                        x="50%"
                        y="50%"
                        dy=".3em"
                        textAnchor="middle"
                        fill="#FFF"
                        className="text-sm font-semibold"
                      >
                        Ingresar/Registro
                      </text>

                      {/* Efecto hover - solo en desktop */}
                      <rect
                        x="0"
                        y="0"
                        width="140"
                        height="36"
                        rx="18"
                        fill="#FFF"
                        opacity="0"
                        className="sm:group-hover:opacity-10 transition-opacity duration-300"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
              {!isLoggedIn && (
                <DisclosureButton
                  as="button"
                  onClick={handleLogin}
                  className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white text-left"
                >
                  Ingresar/Registro
                </DisclosureButton>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
