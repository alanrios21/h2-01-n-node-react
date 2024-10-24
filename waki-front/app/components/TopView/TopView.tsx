"use client";

import React, { useEffect, useState } from "react";
import DefaultAvatar from "@/app/assets/avatar/people1.jpeg";
import IconBall from "@/app/assets/icon-ball.png";
import Image from "next/image";
import "./topview.css";
import Cookies from "js-cookie";

export default function TopView() {
  const [userProfile, setUserProfile] = useState<{ username: string; profileImage?: string | null }>({
    username: "Usuario",
    profileImage: null,
  });

  const fetchUserProfile = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("Token no disponible");
      return;
    }

    try {
      const response = await fetch("https://waki.onrender.com/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          username: data.username,
          profileImage: data.profileImage || null, 
        });
      } else {
        console.error("Error al obtener perfil:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud de perfil:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); 
  }, []);

  return (
      <div className="component-imagen">
        <Image
          priority={true}
          alt="Imagen de Perfil"
          className="avatarImg"
          src={userProfile.profileImage || DefaultAvatar}
          width={50}
          height={50}
        />
        <div className="welcome-user">¡Hola, {userProfile.username}! </div>
        <div className="icon-ball-container">
          <Image
            priority={true}
            alt="Icono de balón"
            className="icon-ball"
            src={IconBall}
            width={35}
            height={35}
          />
      
            <h1 className="counter-life">5</h1>
          
          <button className="buy-button">+</button>
        </div>
      </div>
  );
}
