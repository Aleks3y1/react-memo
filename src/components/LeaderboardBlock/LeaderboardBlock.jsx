import { useCustomContext } from "../../hooks/useCustomContext";
import styles from "../../pages/Leaderboard/Leaderboard.module.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import AchiveDescription from "../AchiveDescription/AchiveDescription";
import React from "react";

const ACHIEVEMENTS = {
  HARD_MODE: 1,
  NO_SUPERPOWERS: 2,
};

const getAchievementIcon = (achievements, id, type) => {
  switch (id) {
    case ACHIEVEMENTS.HARD_MODE:
      return type === "on" ? "frame_on" : "frame_off";
    case ACHIEVEMENTS.NO_SUPERPOWERS:
      return type === "on" ? "magic_on" : "magic_off";
    default:
      return "";
  }
};

export function LeaderboardBlock() {
  const { leaderboard } = useCustomContext();
  const navigate = useNavigate();
  const sortedLeaderboard = leaderboard.sort((a, b) => a.time - b.time).slice(0, 10);
  console.log(sortedLeaderboard);

  const startGame = () => {
    navigate("/");
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const descriptions = () => {
    return (
      <div>
        <span className={styles.helps_text}>Игра пройден в сложном режиме</span>
      </div>
    );
  };

  const descriptionCard = () => {
    return (
      <div>
        <span className={styles.helps_text}>Игра пройдена без супер-сил</span>
      </div>
    );
  };

  return (
    <div className={styles.container_leader}>
      <div className={styles.container_leader_block}>
        <div className={styles.container_leader_top}>
          <span>Лидерборд</span>
          <Button onClick={startGame}>Начать игру</Button>
        </div>
        <ul>
          <li className={styles.position}>
            <div className={styles.position_information}>
              <span>Позиция</span>
              <span>Пользователь</span>
              <span>Достижения</span>
              <span>Время</span>
            </div>
          </li>
          {sortedLeaderboard.map((leader, index) => (
            <li key={leader.id} className={styles.position}>
              <div className={styles.position_information}>
                <span>{index + 1}</span>
                <span>{leader.name}</span>
                <span>
                  {leader.achievements.includes(ACHIEVEMENTS.HARD_MODE) ? (
                    <AchiveDescription description={descriptions()}>
                      <img
                        src={`${process.env.PUBLIC_URL}/${getAchievementIcon(
                          leader.achievements,
                          ACHIEVEMENTS.HARD_MODE,
                          leader.achievements.includes(ACHIEVEMENTS.HARD_MODE) ? "on" : "off",
                        )}.svg`}
                        alt={
                          leader.achievements.includes(ACHIEVEMENTS.HARD_MODE) ? "сложный режим" : "не сложный режим"
                        }
                      />
                    </AchiveDescription>
                  ) : (
                    <div className={styles.achive}>
                      <img
                        src={`${process.env.PUBLIC_URL}/${getAchievementIcon(
                          leader.achievements,
                          ACHIEVEMENTS.HARD_MODE,
                          leader.achievements.includes(ACHIEVEMENTS.HARD_MODE) ? "on" : "off",
                        )}.svg`}
                        alt={
                          leader.achievements.includes(ACHIEVEMENTS.HARD_MODE) ? "сложный режим" : "не сложный режим"
                        }
                      />
                    </div>
                  )}
                  {leader.achievements.includes(ACHIEVEMENTS.NO_SUPERPOWERS) ? (
                    <AchiveDescription description={descriptionCard()} style={{ marginLeft: "38px" }}>
                      <img
                        src={`${process.env.PUBLIC_URL}/${getAchievementIcon(
                          leader.achievements,
                          ACHIEVEMENTS.NO_SUPERPOWERS,
                          leader.achievements.includes(ACHIEVEMENTS.NO_SUPERPOWERS) ? "on" : "off",
                        )}.svg`}
                        alt={
                          leader.achievements.includes(ACHIEVEMENTS.NO_SUPERPOWERS) ? "без суперсил" : "с суперсилами"
                        }
                      />
                    </AchiveDescription>
                  ) : (
                    <div className={styles.achive} style={{ marginLeft: "38px" }}>
                      <img
                        src={`${process.env.PUBLIC_URL}/${getAchievementIcon(
                          leader.achievements,
                          ACHIEVEMENTS.NO_SUPERPOWERS,
                          leader.achievements.includes(ACHIEVEMENTS.NO_SUPERPOWERS) ? "on" : "off",
                        )}.svg`}
                        alt={
                          leader.achievements.includes(ACHIEVEMENTS.NO_SUPERPOWERS) ? "без суперсил" : "с суперсилами"
                        }
                      />
                    </div>
                  )}
                </span>
                <span>{formatTime(leader.time)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
