import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useCustomContext } from "../../hooks/useCustomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLeader, getLeaderboard } from "../../api";

const ACHIEVEMENTS = {
  HARD_MODE: 1,
  NO_SUPERPOWERS: 2,
};

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, hardGame }) {
  const title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emoji" : "dead emoji";
  const { handleLeaderboardChange, isAlahomoraUsed, isClairvoyanceUsed } = useCustomContext();
  const [isHardMode, setIsHardMode] = useState(false);
  const resultTime = gameDurationMinutes * 60 + gameDurationSeconds;
  const [isInLeaderboard, setIsInLeaderboard] = useState(false);
  const [name, setName] = useState("");
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsHardMode(hardGame === 9);
  }, [hardGame]);

  useEffect(() => {
    if (isWon && isHardMode) {
      getLeaderboard()
        .then(data => {
          const leaders = data.leaders.sort((a, b) => a.time - b.time).slice(0, 10);
          handleLeaderboardChange(leaders);
          const leadersTimes = leaders.map(leader => leader.time);
          const isTopTen = leadersTimes.length < 10 || resultTime < Math.max(...leadersTimes);
          setIsInLeaderboard(isTopTen);
        })
        .catch(error => {
          console.error("Ошибка:", error);
        });
    }
  }, [isWon, resultTime, handleLeaderboardChange, isHardMode]);

  useEffect(() => {
    const earnedAchievements = [];
    const easyGame = localStorage.getItem("isEasyMode");

    if (easyGame !== "true" && isHardMode) {
      earnedAchievements.push(ACHIEVEMENTS.HARD_MODE);
    }

    if (!isAlahomoraUsed && !isClairvoyanceUsed && isWon) {
      earnedAchievements.push(ACHIEVEMENTS.NO_SUPERPOWERS);
    }

    setAchievements(earnedAchievements);
  }, [isHardMode, isAlahomoraUsed, isClairvoyanceUsed, isWon]);

  const handleSaveResult = async () => {
    const playerName = name.trim() || "";
    try {
      const updatedLeaderboard = await addLeader(playerName, resultTime, achievements);
      handleLeaderboardChange(updatedLeaderboard.leaders);
      navigate("/leaderboard");
    } catch (error) {
      console.log("Ошибка:", error);
    }
  };

  const handlePlayAgain = async () => {
    if (isWon && isHardMode && isInLeaderboard) {
      await handleSaveResult();
    }
    onClick();
  };

  const handleGoToLeaderboard = async () => {
    navigate("/leaderboard");
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      {isHardMode && isInLeaderboard && (
        <>
          <h2 className={styles.title}>Вы попали на Лидерборд!</h2>
          <input
            type="text"
            placeholder="Пользователь"
            className={styles.leader_name}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button onClick={handleSaveResult}>Добавить в лидеры</Button>
        </>
      )}
      {!isInLeaderboard && <h2 className={styles.title}>{title}</h2>}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart(2, "0")}.{gameDurationSeconds.toString().padStart(2, "0")}
      </div>
      <Button onClick={handlePlayAgain}>Играть снова</Button>
      <p onClick={handleGoToLeaderboard} className={styles.link_leader}>
        Перейти к лидерборду
      </p>
    </div>
  );
}
