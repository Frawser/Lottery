import React, { useState, useEffect } from "react";
import fetchDataFromUrl from "../Api-fetcher/fetchDataFromUrl";
import "../Styling/Bouncing.css";
import "../Styling/Background.css";
import "../Styling/Fonts.css";
import "../Styling/Vinst.css";
import "../Styling/Winner.css";

interface LotteryData {
  drawResult: string;
  customerNumber: string;
  winAmount: string;
  winAmountCurreny: string;
}

const LotteryComparison = () => {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<number[][]>([]);
  const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);
  const [numberOfRows, setNumberOfRows] = useState(1);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalMatchedNumber, setFinalMatchedNumber] = useState<number | null>(
    null
  );
  const [finalMatchedAnimationCompleted, setFinalMatchedAnimationCompleted] =
    useState(false);
  const [amountWon, setAmountWon] = useState<number>(0);
  const [numMatchingNumbers, setNumMatchingNumbers] = useState<number>(0);
  const [data, setData] = useState<LotteryData | null>(null);
  const [showAntalRatt, setShowAntalRatt] = useState(false);
  const [showGreenOutline, setShowGreenOutline] = useState(false);

  useEffect(() => {
    fetchDataFromUrl()
      .then((responseData: LotteryData) => {
        setData(responseData);
        console.log("Data fetched from URL:", responseData);
      })
      .catch((error) => {
        console.error("Error fetching data from URL:", error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      setWinningNumbers(data.drawResult.split(";").map(Number));
      setUserNumbers(
        data.customerNumber
          .split(",")
          .map((row: string) => row.split(";").map(Number))
      );
      setAnimationCompleted(true);
    }
  }, [data]);

  useEffect(() => {
    const matched = userNumbers
      .flat()
      .filter((number) => winningNumbers.includes(number));
    setMatchedNumbers(matched);
  }, [winningNumbers, userNumbers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationCompleted(true);
    }, 5500);

    const resultTimeout = setTimeout(() => {
      setShowResult(true);
    }, 5500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(resultTimeout);
    };
  }, [matchedNumbers]);

  useEffect(() => {
    if (finalMatchedAnimationCompleted) {
      const timeout = setTimeout(() => {
        const matchedCount = matchedNumbers.length;
        setFinalMatchedNumber(matchedCount > 0 ? matchedCount : null);

        setAmountWon(Number(data?.winAmount));
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [finalMatchedAnimationCompleted, matchedNumbers, data]);

  useEffect(() => {
    if (animationCompleted) {
      const timeout = setTimeout(() => {
        setFinalMatchedAnimationCompleted(true);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [animationCompleted]);

  const handleRandomizeUserNumbers = (randomNumberOfRows: number) => {
    const rows = Array.from({ length: randomNumberOfRows }, () =>
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 99) + 1)
    );
    setUserNumbers(rows);
  };

  useEffect(() => {
    const antalRattTimer = setTimeout(() => {
      setShowAntalRatt(true);
    }, 6000);
    return () => clearTimeout(antalRattTimer);
  }, []);

  useEffect(() => {
    const greenOutlineTimer = setTimeout(() => {
      setShowGreenOutline(true);
    }, 6000);
    return () => clearTimeout(greenOutlineTimer);
  }, []);

  return (
    <div className="container text-center" style={{ position: "relative" }}>
      <div>
        <h3
          className={`honk-font fs-1 mt-2 ${
            showResult && "show grattis-message"
          }`}
        >
          {showResult &&
            (matchedNumbers.length > 0
              ? "Grattis! En vinst!"
              : "Tyvärr, inga rätt!")}
        </h3>
      </div>
      <div>
        {animationCompleted && showAntalRatt && (
          <h3 className="honk-font fs-1 mt-2 show antal-ratt-message">
            Antal Rätt: {matchedNumbers.length}
          </h3>
        )}
      </div>
      <h1 className="honk-font fs-1">Rätt Rad:</h1>
      <div className="text-xl animated-winning-numbers ball">
        {winningNumbers.map((number, index) => {
          const isMatched = matchedNumbers.includes(number);
          return (
            <span
              key={index}
              className={`animated-winning-number ${
                index === winningNumbers.length - 1 ? "last-orange-ball" : ""
              } ${
                isMatched && animationCompleted && showGreenOutline
                  ? "matched-numbers-row slide-top"
                  : ""
              }`}
            >
              {number}
            </span>
          );
        })}
      </div>

      <h2 className="honk-font fs-1 mt-1">Dina Rader:</h2>
      {userNumbers.map((row, rowIndex) => (
        <div key={rowIndex}>
          <div className="row-numbers mt-1 p-1 mx-auto">
            <div className="user-number-row">
              {row.map((number, index) => {
                const isMatched = matchedNumbers.includes(number);
                return (
                  <span
                    key={index}
                    className={`user-number ${
                      isMatched && animationCompleted && showGreenOutline
                        ? "matched-numbers-row slide-top"
                        : ""
                    }`}
                  >
                    {number}
                  </span>
                );
              })}
            </div>
            <div className="matched-count">
              {showAntalRatt && (
                <span
                  className={`honk-font fs-1 from-left ${
                    finalMatchedAnimationCompleted ? "show" : ""
                  }`}
                >
                  Antal Rätt:{" "}
                  {finalMatchedAnimationCompleted
                    ? finalMatchedNumber !== null
                      ? row.filter((number) => matchedNumbers.includes(number))
                          .length
                      : "0"
                    : ""}
                </span>
              )}
            </div>
          </div>
          {rowIndex < userNumbers.length - 1 && <hr className="blue-line" />}
        </div>
      ))}

      {animationCompleted && matchedNumbers.length > 0 && (
        <div className="card vinst-card win-card">
          <div className="card-body vinst-card-content">
            <h5 className="card-title ">Vinstresultat:</h5>
            <p className="card-text">
              Du vann: {amountWon}kr med {matchedNumbers.length} matchande
              nummer.
            </p>
          </div>
        </div>
      )}
      {animationCompleted && finalMatchedAnimationCompleted && (
        <div>
          {matchedNumbers.length > 0 && matchedNumbers.length <= 2 && (
            <>
              <p className="winner-ani-1">WINNER</p>
              <p className="winner-ani-5">WINNER</p>
            </>
          )}
          {matchedNumbers.length > 2 && matchedNumbers.length <= 4 && (
            <>
              <p className="winner-ani-1">WINNER</p>
              <p className="winner-ani-2">WINNER</p>
              <p className="winner-ani-5">WINNER</p>
              <p className="winner-ani-6">WINNER</p>
            </>
          )}
          {matchedNumbers.length > 4 && (
            <>
              <p className="winner-ani-1">WINNER</p>
              <p className="winner-ani-2">WINNER</p>
              <p className="winner-ani-3">WINNER</p>
              <p className="winner-ani-5">WINNER</p>
              <p className="winner-ani-6">WINNER</p>
              <p className="winner-ani-7">WINNER</p>
            </>
          )}
          {matchedNumbers.length >= 6 && (
            <>
              <p className="winner-ani-1">BIG WIN!!!</p>
              <p className="winner-ani-2">BIG WIN!!!</p>
              <p className="winner-ani-3">BIG WIN!!!</p>
              <p className="winner-ani-4">BIG WIN!!!</p>
              <p className="winner-ani-5">BIG WIN!!!</p>
              <p className="winner-ani-6">BIG WIN!!!</p>
              <p className="winner-ani-7">BIG WIN!!!</p>
              <p className="winner-ani-8">BIG WIN!!!</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LotteryComparison;
