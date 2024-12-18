/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { ReactNode } from "react";
import { useState, useEffect } from "react";
import "./predicciones.css";
import Image from "next/image";
import Flecha from "@/app/assets/flecha.png";
import iconBall from "@/app/assets/icon-ball.png";
import Header from "../../components/Navbar/Navbar";
import MenuInferior from "@/app/components/MenuInferior/MenuInferior";
import CardStatis from "@/app/components/CardStatis/CardStatis";
import CamisetaIcon from "@/app/assets/camisetaicon.png";
import CanchaIcon from "@/app/assets/cancha.png";
import BarselonaImg from "@/app/assets/escudos/fc-barcelona.svg";
import OsasunaImg from "@/app/assets/escudos/osasuna.svg";
import IconCopa from "@/app/assets/iconCopa.png";
import IconCheck from "@/app/assets/iconCheck.png";
import BotomChat from "@/app/components/BotomChat/BotomChat";
import Link from "next/link";
import IconBall from "@/app/assets/icon-ball.png";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { useTheme } from "@/app/components/context/ThemeContext";
import CryptoJS from "crypto-js";
interface MatchStatistic {
  team: string;
  percentage: number;
}
interface MatchStatisticsCardProps {
  statistics: MatchStatistic[];
}

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
}

interface Team {
  id: number;
  name: string;
  code: string;
  founded: number;
  national: boolean;
  logo: string;
}

interface FixtureBetOdds {
  fixtureBetId: number;
  value: string;
  odd: string;
}

interface FixtureBet {
  id: number;
  leagueId: number;
  fixtureId: number;
  fixtureBetOdds: FixtureBetOdds[];
}

interface Fixture {
  time: ReactNode;
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  firstPeriod: number;
  secondPeriod: number;
  statusLong: string;
  statusShort: string;
  statusElapsed: number;
  statusExtra: number;
  season: number;
  round: string;
  homeTeamWinner: boolean;
  awayTeamWinner: boolean;
  homeGoals: number;
  awayGoals: number;
  homeScoreHalftime: number;
  awayScoreHalftime: number;
  homeScoreFulltime: number;
  awayScoreFulltime: number;
  homeScoreExtratime: number | null;
  awayScoreExtratime: number | null;
  homeScorePenalty: number | null;
  awayScorePenalty: number | null;
  venue: Venue;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  fixtureBets: FixtureBet[];
}

interface FixturesResponse {
  fixtures: Fixture[];
}

export default function page() {
  const [activeTab, setActiveTab] = useState("Predicciones");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResultadoPopup, setShowResultadoPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{
    name: string;
    logo: string;
  } | null>(null);

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [matches, setMatches] = useState<any[]>([]);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [matchStatistics, setMatchStatistics] = useState<MatchStatistic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const openModal = () => {
    setShowResultadoPopup(false);
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const router = useRouter();

  const tabs = [
    { id: "Predicciones", label: "Predicciones" },
    { id: "Detalles", label: "Detalles" },
    { id: "Clasificación", label: "Clasificación" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  /*FUNCION DE RESULTADO*/
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option === "Resultado") {
      setShowResultadoPopup(true);
    }
  };

  const handleTeamSelect = (team: {
    name: string;
    logo: string;
  }) => {
    setSelectedTeam(team);
  };

  const handleContinue = () => {
    if (selectedTeam) {
      setShowConfirmationPopup(true);
    }
  };

  const handleConfirm = async () => {
    const AGGREGATE_URL = `${API_BASE_URL}/predictions`;
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const fixtureResponse = await fetch(FIXTURE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!fixtureResponse.ok) {
        const errorData = await fixtureResponse.json();
        console.error("Error al obtener los detalles del fixture:", errorData);
        return;
      }

      const fixtureData = await fixtureResponse.json();
      const fixtureBets = fixtureData.fixture.fixtureBets;

      if (!fixtureBets || fixtureBets.length === 0) {
        console.error("No hay datos en fixtureBets");
        return;
      }

      const fixtureId = fixtureData.fixture.id;
      const fixtureBetOdds = fixtureBets[0].fixtureBetOdds;

     
      if (!fixtureBetOdds || fixtureBetOdds.length < 1) {
        console.error("No hay suficientes datos en fixtureBetOdds");
        return;
      }

      const payload = {
        value: fixtureBetOdds[0].value,
        betId: fixtureBets[0].betId,
        fixtureId: fixtureId,
      };

      const response = await fetch(AGGREGATE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        setShowConfirmationPopup(false);
        setShowSuccessMessage(true);

        if (
          data &&
          data.data &&
          data.data.predictions &&
          data.data.predictions.length > 0
        ) {
          const formattedPredictions = data.data.predictions.map(
            (prediction: any) => ({
              value: prediction.value,
              odd: prediction.odd,
              betId: prediction.betId,
              fixtureId: prediction.fixtureId,
            })
          );
        } else {
          console.error(
            "Error: La respuesta no contiene predicciones válidas",
            data
          );
        }
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los datos:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTooltipOpen = (teamName: string) => {
    setTooltip(teamName);
  };

  const handleTooltipClose = () => {
    setTooltip(null);
  };

  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string;
  // Función para leer y desencriptar desde la cookie
  const getDecryptedDateFromCookie = (): string | null => {
    const encryptedDate = Cookies.get("fixture");
    if (encryptedDate) {
      const bytes = CryptoJS.AES.decrypt(encryptedDate, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setShowResultadoPopup(false);
        setIsOpen(false);
        // Reset other states as needed
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const fixtureId = getDecryptedDateFromCookie();
  const API_BASE_URL = "https://waki.onrender.com/api";
  const FIXTURE_URL = `${API_BASE_URL}/fixtures/${fixtureId}`;

  useEffect(() => {
    const fetchMatches = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await fetch(FIXTURE_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data && data.fixture) {
            const fixture = data.fixture;

            const fixtureBets = fixture.fixtureBets[0]?.fixtureBetOdds || [];
            const newStatistics: MatchStatistic[] = [
              {
                team: fixture.homeTeam.name,
                percentage: fixtureBets[0]?.odd || 0,
              },
              {
                team: "Empate",
                percentage: fixtureBets[1]?.odd || 0,
              },
              {
                team: fixture.awayTeam.name,
                percentage: fixtureBets[2]?.odd || 0,
              },
            ];
            setMatchStatistics(newStatistics);

            const matchDate = new Date(fixture.date);
            const date = matchDate.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
            });
            const time = matchDate.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const formattedMatch = {
              id: fixture.id,
              date: date,
              time: time,
              homeGoals: fixture.homeGoals ?? 0,
              awayGoals: fixture.awayGoals ?? 0,
              homeTeam: fixture.homeTeam,
              awayTeam: fixture.awayTeam,
              venue: fixture.venue,
              league: fixture.league,
            };

            setMatches([formattedMatch]);
          } else {
            console.error(
              "Error: La respuesta no contiene un fixture válido",
              data
            );
          }
        } else {
          const errorData = await response.json();
          console.error("Error al obtener los datos:", errorData);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FIXTURE_URL, router]);

  return (
    <>
      <div>
        <div className="header">
          <Link href="/partidos" className="flex items-center">
            <Image
              src={Flecha}
              alt="Flecha hacia atras"
              className="flechaImg mr-5"
            />
            <span className="partidosAtras">Partidos</span>
          </Link>
        </div>
        {/*TOP CURVE VERDE CON ESCUDOS*/}
        <div className="top-curve">
          <h1 className="subtitle-curve">
            Eliminatorias, cuartos de final, primer partido
          </h1>

          {loading ? (
            <div className="loader-container">
              <ClipLoader color={"#123abc"} loading={loading} size={50} />
            </div>
          ) : matches.length > 0 ? (
            matches.map((match, index) => (
              <div key={index} className="container-curve">
                <div className="team-container">
                  <Image
                    src={match.homeTeam.logo || OsasunaImg}
                    alt={`Logo del equipo local - ${match.homeTeam.name}`}
                    width={10}
                    height={10}
                    className="escudos-curve"
                  />
                  <Tooltip
                    title={match.homeTeam?.name}
                    open={tooltip === match.homeTeam?.name}
                    onClose={handleTooltipClose}
                    onClick={() => handleTooltipOpen(match.homeTeam?.name)}
                    arrow
                  >
                    <span className="team-span font-semibold text-sm ml-5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                      {match.homeTeam?.name}
                    </span>
                  </Tooltip>
                </div>
                <div>
                  <h1 className="date-curve">
                    {new Date(match.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </h1>
                  <h1 className="time-curve">{match.time}</h1>
                </div>
                <div className="team-container">
                  <Image
                    src={match.awayTeam.logo || BarselonaImg}
                    alt={`Logo del equipo visitante - ${match.awayTeam.name}`}
                    width={10}
                    height={10}
                    className="escudos-curve"
                  />
                  <Tooltip
                    title={match.awayTeam.name}
                    open={tooltip === match.awayTeam.name}
                    onClose={handleTooltipClose}
                    onClick={() => handleTooltipOpen(match.awayTeam.name)}
                    arrow
                  >
                    <span className="team-span font-semibold text-sm ml-5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] text-center cursor-pointer">
                      {match.awayTeam.name}
                    </span>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p>{!matches ? "Cargando..." : ""}</p>
          )}
        </div>

        <Header
          tabs={tabs}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
        <h1 className="title-section">Tus Predicciones</h1>
        <div className="predicciones-container">
          <h1 className="sub-predicciones">¡Todavia estas a tiempo!</h1>
          <button className="btnPrediccion" onClick={() => setIsOpen(true)}>
            Hacer Predicción
          </button>

          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className={`rounded-lg p-6 w-80 relative ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2
                  className={`text-xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  ¿En que vas a apostar?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      selectedOption === "Resultado"
                        ? "bg-blue-500"
                        : isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleOptionClick("Resultado")}
                  >
                    <Image
                      src={CanchaIcon}
                      alt="Resultado"
                      width={32}
                      height={32}
                      className="mb-2"
                    />
                    <span className={isDarkMode ? "text-white" : "text-black"}>
                      Resultado
                    </span>
                  </button>
                  <button
                    className={`p-4 rounded-lg flex flex-col items-center ${
                      selectedOption === "Gol por jugador"
                        ? "bg-blue-500"
                        : isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedOption("Gol por jugador")}
                  >
                    <Image
                      src={CamisetaIcon}
                      alt="Gol por jugador"
                      width={32}
                      height={32}
                      className="mb-2"
                    />
                    <span className={isDarkMode ? "text-white" : "text-black"}>
                      Gol por jugador
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResultadoPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className={`rounded-lg p-6 w-80 relative ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <button
                  className="absolute top-2 left-2 text-purple-500 hover:text-purple-700"
                  onClick={() => setShowResultadoPopup(false)}
                >
                  <Image src={Flecha} alt="Back" width={24} height={24} />
                </button>
                <button
                  className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
                  onClick={() => {
                    setShowResultadoPopup(false);
                    setIsOpen(false);
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Elige quién ganará
                </h2>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Selecciona una opción
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {matches.map((match) => (
                    <React.Fragment key={match.id}>
                      <button
                        className={`p-4 border rounded-lg flex flex-col items-center ${
                          selectedTeam?.name === match.homeTeam.name
                            ? "border-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamSelect({
                            name: match.homeTeam.name,
                            logo: match.homeTeam.logo,
                          })
                        }
                      >
                        <Image
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          width={48}
                          height={48}
                          className="mb-2"
                        />
                        <span>{match.homeTeam.name}</span>
                        <span className="text-sm text-gray-500">
                          {matchStatistics.find(
                            (stat) => stat.team === match.homeTeam.name
                          )?.percentage || "Sin datos"}
                        </span>
                      </button>
                      <button
                        className={`p-4 border rounded-lg flex flex-col items-center ${
                          selectedTeam?.name === match.awayTeam.name
                            ? "border-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamSelect({
                            name: match.awayTeam.name,
                            logo: match.awayTeam.logo,
                          })
                        }
                      >
                        <Image
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          width={48}
                          height={48}
                          className="mb-2"
                        />
                        <span>{match.awayTeam.name}</span>
                        <span className="text-sm text-gray-500">
                          {matchStatistics.find(
                            (stat) => stat.team === match.awayTeam.name
                          )?.percentage || "Sin datos"}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <button
                  className={`w-full p-4 border rounded-lg flex flex-col items-center mb-4 ${
                    selectedTeam?.name === "Empate" ? "border-blue-500" : ""
                  }`}
                  onClick={() =>
                    handleTeamSelect({
                      name: "Empate",
                      logo: "/assets/default-logo.png",
                    })
                  }
                >
                  <span>Empate</span>
                  <span className="text-sm text-gray-500">
                    {matchStatistics.find((stat) => stat.team === "Empate")
                      ?.percentage || "Sin datos"}
                  </span>
                </button>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 border rounded-lg text-gray-500"
                    id="btnCardCombinada"
                    onClick={openModal}
                  >
                    Hacer combinada
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-500 rounded-lg"
                    id="btnCard"
                    onClick={handleContinue}
                  >
                    Continuar
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${((selectedOption ? 1 : 0) / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-purple-600 ml-2">
                    {selectedOption ? 1 : 0}/5
                  </span>
                </div>
              </div>
            </div>
          )}

          {showConfirmationPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className={`rounded-lg p-6 w-80 relative ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <button
                  className="absolute top-2 left-2 text-purple-500 hover:text-purple-700"
                  onClick={() => setShowConfirmationPopup(false)}
                >
                  <Image src={Flecha} alt="Back" width={24} height={24} />
                </button>
                <button
                  className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
                  onClick={() => {
                    setShowConfirmationPopup(false);
                    setShowResultadoPopup(false);
                    setIsOpen(false);
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <h2
                  className={`text-xl font-bold mb-6 text-center ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  ¿Estás seguro de tu predicción?
                </h2>
                {selectedTeam && (
                  <div
                    className={`rounded-lg p-4 flex items-center mb-6 ${
                      isDarkMode ? "bg-gray-700" : "bg-blue-100"
                    }`}
                  >
                    {selectedTeam.name !== "Empate" && (
                      <Image
                        src={selectedTeam.logo}
                        alt={selectedTeam.name}
                        width={64}
                        height={64}
                        className="mr-4"
                      />
                    )}
                    <div>
                      <p
                        className={`font-bold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {selectedTeam.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-black"
                        }`}
                      >
                        <Image
                          src={IconCopa}
                          alt="Trophy"
                          width={16}
                          height={16}
                          className="inline mr-1"
                        />
                        x 10
                      </p>
                    </div>
                  </div>
                )}

                <button
                  className={`w-full py-3 rounded-lg font-bold ${
                    isDarkMode ? "bg-purple-600" : "bg-purple-500"
                  }`}
                  onClick={handleConfirm}
                >
                  Sí, predecir
                </button>
                <div className="mt-6 flex items-center justify-between">
                  <div
                    className={`w-full rounded-full h-2.5 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm text-purple-600 ml-2 ${
                      isDarkMode ? "text-gray-300" : "text-black"
                    }`}
                  >
                    1/5
                  </span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Image
                    src={iconBall}
                    alt="Coin"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                </div>
              </div>
            </div>
          )}

          {showSuccessMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className={`rounded-lg p-6 w-80 flex flex-col items-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <Image
                  src={IconCheck}
                  alt="Checkmark"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h2
                  className={`text-xl font-bold text-center ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Se ha añadido tu predicción
                </h2>
              </div>
            </div>
          )}
        </div>

        <h1 className="title-section2">Pronóstico general</h1>
        <div className="p-3">
          <CardStatis statistics={matchStatistics} />
        </div>
      </div>
      <BotomChat />
      <MenuInferior />
    </>
  );
}
