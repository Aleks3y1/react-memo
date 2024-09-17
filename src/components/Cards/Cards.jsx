import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../EndGameModal/EndGameModal";
import { Card } from "../Card/Card";
import { AttemptsCounter } from "../AttemptsCounter/AttemptsCounter";
import { useCustomContext } from "../../hooks/useCustomContext";
import { Helps } from "../Helps/Helps";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return { minutes: 0, seconds: 0 };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return { minutes, seconds };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const {
    attempts,
    startLife,
    handleAttemptsChange,
    hardGame,
    handleIsAlahomora,
    isAlahomoraUsed,
    isClairvoyanceUsed,
    handleIsClairvoyance,
  } = useCustomContext();
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [playerLost, setPlayerLost] = useState(false);
  const [isInLeaderboard] = useState(hardGame);

  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 });

  useEffect(() => {
    if (attempts === 0) {
      setPlayerLost(true);
      finishGame(STATUS_LOST);
    }
  }, [attempts]);

  function finishGame(status) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    handleAttemptsChange(startLife);
    setPlayerLost(false);
    handleIsAlahomora(false);
    handleIsClairvoyance(false);
  }

  const openCard = clickedCard => {
    if (clickedCard.open) return;

    const nextCards = cards.map(card => (card.id !== clickedCard.id ? card : { ...card, open: true }));
    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    const openCards = nextCards.filter(card => card.open);
    const openCardsWithoutPair = openCards.filter(
      card => openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank).length < 2,
    );

    if (openCardsWithoutPair.length >= 2 && attempts > 0) {
      handleAttemptsChange(attempts - 1);

      setTimeout(() => {
        const closeCards = cards.map(card =>
          openCardsWithoutPair.some(openCard => openCard.id === card.id) ? { ...card, open: false } : card,
        );
        setCards(closeCards);
      }, 1000);
    }

    if (playerLost) {
      finishGame(STATUS_LOST);
      handleAttemptsChange(startLife);
      return;
    }
  };

  const alahomora = () => {
    if (isAlahomoraUsed) {
      return;
    }

    const closedCards = cards.filter(card => !card.open);
    if (closedCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * closedCards.length);
      const randomCard = closedCards[randomIndex];
      const pairCard = closedCards.find(
        card => card.suit === randomCard.suit && card.rank === randomCard.rank && card.id !== randomCard.id,
      );

      if (pairCard) {
        const nextCards = cards.map(card => {
          if (card.id === randomCard.id || card.id === pairCard.id) {
            return { ...card, open: true };
          }
          return card;
        });

        setCards(nextCards);
        handleIsAlahomora(true);
        const allCardsOpen = nextCards.every(card => card.open);
        if (allCardsOpen) {
          finishGame(STATUS_WON);
        }
      }
    }
  };

  const clairvoyance = () => {
    if (isClairvoyanceUsed) {
      return;
    }

    const initiallyOpenCards = cards.filter(card => card.open);
    const pairsOpenedCards = initiallyOpenCards.filter(card =>
      initiallyOpenCards.some(
        openCard => openCard.id !== card.id && openCard.suit === card.suit && openCard.rank === card.rank,
      ),
    );

    const nextCards = cards.map(card => (card.open ? card : { ...card, open: true }));
    setCards(nextCards);
    handleIsClairvoyance(true);

    const savedGameEndDate = gameEndDate;
    const savedGameStartDate = gameStartDate;
    const pauseStartDate = new Date();
    setGameEndDate(pauseStartDate);

    setTimeout(() => {
      const pauseEndDate = new Date();
      const pauseDuration = pauseEndDate - pauseStartDate;
      setGameStartDate(new Date(savedGameStartDate.getTime() + pauseDuration));
      setGameEndDate(savedGameEndDate);

      const finalCards = nextCards.map(card =>
        pairsOpenedCards.some(openCard => openCard.id === card.id) ? card : { ...card, open: false },
      );
      setCards(finalCards);
    }, 5000);
  };

  useEffect(() => {
    if (status !== STATUS_IN_PROGRESS) return;

    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);

    return () => clearInterval(intervalId);
  }, [gameStartDate, gameEndDate, status]);

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) return;

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => shuffle(generateDeck(pairsCount, 10)));

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => clearTimeout(timerId);
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => clearInterval(intervalId);
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart(2, "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart(2, "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <Helps resetGame={resetGame} alahomora={alahomora} clairvoyance={clairvoyance} />
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
        <AttemptsCounter value={attempts} />
      </div>

      {isGameEnded && (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            hardMode={startLife}
            hardGame={hardGame}
            onClick={resetGame}
            isInLeaderboard={isInLeaderboard}
          />
        </div>
      )}
    </div>
  );
}
