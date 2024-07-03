import styles from "./AttemptsCounter.module.css";

export function AttemptsCounter({ value }) {
  return (
    <div className={styles.attemptsBlock}>
      <span className={styles.attemptsText}>Осталось {value} попытки</span>
    </div>
  );
}
