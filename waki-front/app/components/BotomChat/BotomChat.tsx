"use client";
import React, { useState } from "react";
import "./botomchat.css";
import { useRouter } from "next/navigation";
import { IoChatbubblesOutline } from "react-icons/io5";

export default function BotomChat() {

  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeIcon, setActiveIcon] = useState<string>("faqbot");

  const handleIconClick = (icon: string) => {
    if (icon === "faqbot") {
      router.push("/faqbot");
    }
    setActiveIcon(icon);
  };
  return (
    <div>
      <div className="fixed bottom-6 right-6">
        <button
          className="bg-black rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
          onClick={() => handleIconClick("faqbot")}
          id="btmColor"
        >
          <IoChatbubblesOutline className="w-8 h-8 text-white" />
          <span className="sr-only">Ir al chat FAQ</span>
        </button>
      </div>
    </div>
  );
}
