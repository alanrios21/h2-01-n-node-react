"use client";
import { useState } from "react";
import Image from "next/image";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import "./divisiones.css";
import Header from "../../components/Navbar/Navbar";
import divisionLogo from "../../assets/divisiones/division-bronce3.png";
import BotomChat from '@/app/components/BotomChat/BotomChat'

const Divisiones = () => {
  const [activeTab, setActiveTab] = useState("Ranking");

  const tabs = [
    { id: "Ranking", label: "Ranking" },
    { id: "Rewards", label: "Rewards" },
    { id: "Quests", label: "Quests" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <h1 className="titulo-divisiones">Divisiones</h1>
      <Header tabs={tabs} onTabChange={handleTabChange} activeTab={activeTab} />
      {/*ACA VAN LAS IMAGENES*/}
      <div className="divisiones-imagen">
        <Image
          priority={true}
          alt="Logo Divisiones"
          className="divisionImg"
          src={divisionLogo}
        />
      </div>
      <h1 className="division-var">Division Bronce</h1>
      {/*Esto sera una variable que saldra de la api ya que es dinamico*/}
      <div className=" min-h-screen flex flex-col items-center px-4 mt-4">
        {activeTab === "Ranking" && (
          <div>
            {/* Pantalla Ranking */}
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 custom-margin">
                <div className="overflow-hidden shadow-md rounded-lg">
                  <table className="min-w-full text-left text-sm font-light border-collapse border border-white-200 font-poppins ">
                    <thead className="border-b  font-normal dark:border-white-800 dark:-600">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-xs">
                          #
                        </th>
                        <th scope="col" className="px-6 py-4 text-xs">
                          Nombre de Usuario
                        </th>
                        <th scope="col" className="px-6 py-4 text-xs">
                          Puntos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b -100 dark:border-white-500 dark:-700 ">
                        <td className="whitespace-nowrap px-6 py-4 font-normal">
                          1
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">Mark</td>
                        <td className="whitespace-nowrap px-6 py-4">50</td>
                      </tr>
                      <tr className="border-b  dark:border-white-500 dark:-600 ">
                        <td className="whitespace-nowrap px-6 py-4 font-normal">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                        <td className="whitespace-nowrap px-6 py-4">20</td>
                      </tr>
                      <tr className="border-b  dark:border-white-500 dark:-600 ">
                        <td className="whitespace-nowrap px-6 py-4 font-normal">
                          3
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">John</td>
                        <td className="whitespace-nowrap px-6 py-4">10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Rewards" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rewards</h2>
            {/* Pantalla Rewards */}
          </div>
        )}
        {activeTab === "Quests" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quests</h2>
            {/* Pantalla Quests */}
          </div>
        )}
      </div>
      <BotomChat/>
      <MenuInferior />
    </>
  );
};
export default Divisiones;
