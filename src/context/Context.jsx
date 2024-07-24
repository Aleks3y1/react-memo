import React, { createContext, useState, useCallback, useEffect } from "react";
import { getLeaderboard } from "../api";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const ONE_LIFE = 1;
  const THREE_LIFE = 3;

  const [attempts, setAttempts] = useState(() => {
    const savedAttempts = localStorage.getItem("attempts");
    return savedAttempts ? Number(savedAttempts) : ONE_LIFE;
  });

  const [startLife, setStartLife] = useState(() => {
    const savedStartLife = localStorage.getItem("startLife");
    return savedStartLife ? Number(savedStartLife) : ONE_LIFE;
  });

  const [leaderboard, setLeaderboard] = useState([]);

  const handleLeaderboardChange = useCallback(leaders => {
    setLeaderboard(leaders);
  }, []);

  // Инициализация hardGame из localStorage
  const [hardGame, setHardGame] = useState(() => {
    const savedHardGame = localStorage.getItem("hardGame");
    return savedHardGame ? Number(savedHardGame) : null;
  });

  useEffect(() => {
    getLeaderboard()
      .then(result => {
        setLeaderboard(result.leaders);
      })
      .catch(error => {
        console.log("Ошибка:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("attempts", attempts);
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem("startLife", startLife);
  }, [startLife]);

  useEffect(() => {
    localStorage.setItem("hardGame", hardGame);
  }, [hardGame]);

  const handleAttemptsChangeOnStart = useCallback(() => {
    const newLife = startLife === ONE_LIFE ? THREE_LIFE : ONE_LIFE;
    setAttempts(newLife);
    setStartLife(newLife);
  }, [startLife]);

  const handleAttemptsChange = useCallback(num => {
    setAttempts(num);
  }, []);

  const handleStartLifeChange = useCallback(newLife => {
    setStartLife(newLife);
    setAttempts(newLife);
  }, []);

  const handleHardGameChange = useCallback(num => {
    setHardGame(num);
  }, []);

  return (
    <Context.Provider
      value={{
        attempts,
        handleAttemptsChange,
        handleAttemptsChangeOnStart,
        startLife,
        handleStartLifeChange,
        leaderboard,
        handleLeaderboardChange,
        handleHardGameChange,
        hardGame,
      }}
    >
      {children}
    </Context.Provider>
  );
};
