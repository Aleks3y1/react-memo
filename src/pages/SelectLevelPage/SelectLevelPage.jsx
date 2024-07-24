import { useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useCustomContext } from "../../hooks/useCustomContext";
import { Button } from "../../components/Button/Button";
import { useState, useCallback, useEffect } from "react";
import { LevelStyle } from "./LevelStyle.js";

export function SelectLevelPage() {
  const { handleStartLifeChange, handleHardGameChange } = useCustomContext();
  const [gameLevel, setGameLevel] = useState(0);
  const [isEasyMode, setIsEasyMode] = useState(() => {
    const savedEasyMode = localStorage.getItem("isEasyMode");
    return savedEasyMode ? JSON.parse(savedEasyMode) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isEasyMode) {
      handleStartLifeChange(3);
    } else {
      handleStartLifeChange(1);
    }
  }, [isEasyMode, handleStartLifeChange]);

  useEffect(() => {
    localStorage.setItem("isEasyMode", JSON.stringify(isEasyMode));
  }, [isEasyMode]);

  const handleLevelChange = useCallback(level => {
    setGameLevel(level);
    handleHardGameChange(level);
  }, []);

  const handleCheckboxChange = useCallback(() => {
    setIsEasyMode(prevMode => !prevMode);
  }, []);

  const handlePlayClick = useCallback(() => {
    if (gameLevel === 0) {
      alert(`Не выбрана сложность`);
    } else {
      navigate(`/game/${gameLevel}`);
    }
  }, [gameLevel, navigate]);

  const handleLeaderboard = () => {
    navigate(`/leaderboard`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>
          Выбери
          <br />
          сложность
        </h1>
        <ul className={styles.levels}>
          <li className={styles.level} onClick={() => handleLevelChange(3)} style={LevelStyle(gameLevel, 3)}>
            1
          </li>
          <li className={styles.level} onClick={() => handleLevelChange(6)} style={LevelStyle(gameLevel, 6)}>
            2
          </li>
          <li className={styles.level} onClick={() => handleLevelChange(9)} style={LevelStyle(gameLevel, 9)}>
            3
          </li>
        </ul>
        <label className={styles.labelText}>
          <input type="checkbox" className={styles.checkBox} checked={isEasyMode} onChange={handleCheckboxChange} />
          Легкий режим (3 жизни)
        </label>
        <Button onClick={handlePlayClick}>Играть</Button>
        <p onClick={handleLeaderboard} className={styles.leader_link}>
          Перейти к лидерборду
        </p>
      </div>
    </div>
  );
}
