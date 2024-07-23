import { useCustomContext } from "../../hooks/useCustomContext";
import styles from "../../pages/Leaderboard/Leaderboard.module.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

export function LeaderboardBlock() {
  const { leaderboard } = useCustomContext();
  const navigate = useNavigate();
  const sortedLeaderboard = leaderboard.sort((a, b) => a.time - b.time).slice(0, 10);

  const startGame = () => {
    navigate("/");
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container_leader}>
      <div className={styles.container_leader_block}>
        <div className={styles.container_leader_top}>
          <p>Лидерборд</p>
          <Button onClick={startGame}>Начать игру</Button>
        </div>
        <ul>
          <li className={styles.position}>
            <div className={styles.position_information}>
              <p>Позиция</p>
              <p>Пользователь</p>
              <p></p>
              <p>Время</p>
            </div>
          </li>
          {sortedLeaderboard.map((leader, index) => (
            <li key={leader.id} className={styles.position}>
              <div className={styles.position_information}>
                <p>{index + 1}</p>
                <p>{leader.name}</p>
                <p></p>
                <p>{formatTime(leader.time)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
