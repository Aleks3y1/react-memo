import { createContext, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const ONE_LIFE = 1;
  const THREE_LIFE = 3;
  const [attempts, setAttempts] = useState(ONE_LIFE);
  const [startLife, setStartLife] = useState(ONE_LIFE);
  const handleAttemptsChangeOnStart = () => {
    const newLife = attempts === ONE_LIFE ? THREE_LIFE : ONE_LIFE;
    setAttempts(newLife);
    setStartLife(newLife);
  };
  const handleAttemptsChange = num => {
    setAttempts(num);
  };
  console.log(startLife);

  return (
    <Context.Provider value={{ attempts, handleAttemptsChange, handleAttemptsChangeOnStart, startLife }}>
      {children}
    </Context.Provider>
  );
};
