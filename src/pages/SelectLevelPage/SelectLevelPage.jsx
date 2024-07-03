import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useCustomContext } from "../../hooks/useCustomContext";

export function SelectLevelPage() {
  const { handleAttemptsChangeOnStart } = useCustomContext();

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <label className={styles.labelText}>
          3 попытки
          <input type="checkbox" className={styles.checkBox} onClick={handleAttemptsChangeOnStart} />
        </label>
      </div>
    </div>
  );
}
