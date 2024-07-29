import React from "react";
import { Button } from "../Button/Button";
import styles from "./Helps.module.css";
import ItemWithDescription from "../ItemWithDescription/ItemWithDescription";

export function Helps({ resetGame, alahomora, clairvoyance }) {
  const descriptions = () => {
    return (
      <>
        <div>
          <p className={styles.helps_title}>Алохомора</p>
          <p className={styles.helps_text}>Открывается случайная пара карт.</p>
        </div>
      </>
    );
  };

  const descriptionCard = () => {
    return (
      <>
        <div>
          <p className={styles.helps_title}>Прозрение</p>
          <p className={styles.helps_text}>
            На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.helps_container}>
        <ItemWithDescription description={descriptionCard()}>
          <img src={`${process.env.PUBLIC_URL}/11.svg`} alt="открыть карты" onClick={clairvoyance} />
        </ItemWithDescription>
        <ItemWithDescription description={descriptions()}>
          <img src={`${process.env.PUBLIC_URL}/22.svg`} alt="открыть карты" onClick={alahomora} />
        </ItemWithDescription>
      </div>
      <Button onClick={resetGame}>Начать заново</Button>
    </>
  );
}
