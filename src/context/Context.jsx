import React, { createContext, useState, useCallback, useEffect } from "react";

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

  useEffect(() => {
    localStorage.setItem("attempts", attempts);
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem("startLife", startLife);
  }, [startLife]);

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

  return (
    <Context.Provider
      value={{ attempts, handleAttemptsChange, handleAttemptsChangeOnStart, startLife, handleStartLifeChange }}
    >
      {children}
    </Context.Provider>
  );
};
