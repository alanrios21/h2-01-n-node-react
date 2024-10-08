/* eslint-disable react/jsx-no-undef */
"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Navbar/Navbar";
import ImgGoogle from "../../assets/icon-google.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";
import React from "react";

export default function AuthTabs() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("InicioSesion");

  const tabs = [
    { id: "InicioSesion", label: "Iniciar Sesion" },
    { id: "Registrate", label: "Registrate" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Header tabs={tabs} onTabChange={handleTabChange} />
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
        {activeTab === "InicioSesion" ? (
          // Pantalla de Iniciar Sesión
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#317EF4" }}>
              Bienvenido a Waki,
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Inicie sesión para disfrutar de todas las funciones
            </p>
            <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[#060606] text-sm mb-2"
              >
                Ingresa tu email o teléfono
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email o teléfono"
              />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-[#060606] text-sm mb-2"
              >
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="******************"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="flex justify-center mt-3">
                <span className="text-blue-500 text-xs">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-[#8E2BFF] hover:bg-[#6c22cc] text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="button"
              >
                Iniciar sesión
              </button>
            </div>

            <div className="flex items-center my-4">
              <div
                className="flex-grow border-t border-black"
                style={{ height: "2px" }}
              ></div>
              <span className="mx-4 text-gray-600">O inicia sesión con</span>
              <div
                className="flex-grow border-t border-black"
                style={{ height: "2px" }}
              ></div>
            </div>

            <div className="flex items-center justify-center">
              <button className="bg-gray-200 hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center">
                <Image
                  src={ImgGoogle}
                  width={12}
                  height={12}
                  alt="Google Icon"
                  className="h-5 w-5 mr-2"
                />
                <span style={{ color: "rgba(6, 6, 6, 0.57)" }}>
                  Continuar con Google
                </span>
              </button>
            </div>
          </form>
          </div>
        ) : (
          // Pantalla de Registro
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#317EF4" }}>
              Bienvenido a Waki,
            </h2>
            <p className="text-gray-600 mb-4 text-center">Crea tu cuenta completando los datos</p>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-[#060606] text-sm mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre de usuario"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-[#060606] text-sm mb-2">
                  Ingresa tu email o teléfono
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Email o teléfono"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-[#060606] text-sm mb-2">
                  Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="******************"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="block text-[#060606] text-sm mb-2">
                  Repetir contraseña
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="******************"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-[#8E2BFF] hover:bg-[#6c22cc] text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Registrate
                </button>
              </div>
              <div className="flex items-center my-4">
              <div
                className="flex-grow border-t border-black"
                style={{ height: "2px" }}
              ></div>
              <span className="mx-4 text-gray-600">O registrate con</span>
              <div
                className="flex-grow border-t border-black"
                style={{ height: "2px" }}
              ></div>
            </div>

            <div className="flex items-center justify-center">
              <button className="bg-gray-200 hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center">
                <Image
                  src={ImgGoogle}
                  width={12}
                  height={12}
                  alt="Google Icon"
                  className="h-5 w-5 mr-2"
                />
                <span style={{ color: "rgba(6, 6, 6, 0.57)" }}>
                  Continuar con Google
                </span>
              </button>
            </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
