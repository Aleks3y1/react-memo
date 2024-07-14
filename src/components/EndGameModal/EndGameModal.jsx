import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useCustomContext } from "../../hooks/useCustomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLeader, getLeaderboard } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, hardMode }) {
  const title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emoji" : "dead emoji";
  const { handleLeaderboardChange, handleHardGameChange } = useCustomContext();
  const isHardMode = hardMode !== 3 && handleHardGameChange === 9;
  const resultTime = gameDurationMinutes * 60 + gameDurationSeconds;
  const [isInLeaderboard, setIsInLeaderboard] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isWon && isHardMode) {
      getLeaderboard()
        .then(data => {
          handleLeaderboardChange(data.leaders);
          const leadersTimes = data.leaders.map(leader => leader.time);
          if (resultTime < Math.max(...leadersTimes) || data.leaders.length < 10) {
            setIsInLeaderboard(true);
          }
        })
        .catch(error => {
          console.error("Ошибка:", error);
        });
    }
  }, [isWon, resultTime, handleLeaderboardChange, isHardMode]);

  const handleSaveResult = async () => {
    const playerName = name.trim() || "Пользователь";
    try {
      const updatedLeaderboard = await addLeader(playerName, resultTime);
      handleLeaderboardChange(updatedLeaderboard.leaders);
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
    if (isWon && isHardMode && isInLeaderboard) {
      await handleSaveResult();
    }
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
