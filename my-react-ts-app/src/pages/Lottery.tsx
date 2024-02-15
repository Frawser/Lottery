import React, { useState, useEffect } from "react";

import "../Styling/Bouncing.css";
import "../Styling/Background.css";
import "../Styling/Firework.css";

const LotteryComparison = () => {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<number[][]>([]);
  const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);
  const [numberOfRows, setNumberOfRows] = useState(1);
  const [animationCompleted, setAnimationCompleted] = useState(false); // State variable for animation completion
  const [showResult, setShowResult] = useState(false); // State variable to control the display of result
  const [finalMatchedNumber, setFinalMatchedNumber] = useState<number | null>(
    null
  );
  const [finalMatchedAnimationCompleted, setFinalMatchedAnimationCompleted] =
    useState(false);

  useEffect(() => {
    const fetchWinningNumbers = async () => {
      try {
        const response = await fetch(
          "https://www.thelotter.se/rss.xml?languageid=9"
        );
        const xmlData = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");

        const numbers = parseWinningNumbersFromFeed(xmlDoc);
        setWinningNumbers(numbers);
      } catch (error) {
        console.error("Error fetching winning numbers from RSS feed:", error);
      }
    };

    fetchWinningNumbers();
  }, []);

  useEffect(() => {
    const matched = userNumbers
      .flat()
      .filter((number) => winningNumbers.includes(number));
    setMatchedNumbers(matched);
  }, [winningNumbers, userNumbers]);

  useEffect(() => {
    const randomNumberOfRows = Math.floor(Math.random() * 5) + 1;
    setNumberOfRows(randomNumberOfRows);
    handleRandomizeUserNumbers(randomNumberOfRows);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationCompleted(true);
    }, 5500); // Animation duration

    // After animation completed, show "Antal Rätt" after a slight delay
    const resultTimeout = setTimeout(() => {
      setShowResult(true);
    }, 5500); // Slight delay after animation completion

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
      }, 0); // Delay after animation completion for final number
      return () => clearTimeout(timeout);
    }
  }, [finalMatchedAnimationCompleted, matchedNumbers]);

  useEffect(() => {
    if (animationCompleted) {
      const timeout = setTimeout(() => {
        setFinalMatchedAnimationCompleted(true);
      }, 0); // Delay after animation completion
      return () => clearTimeout(timeout);
    }
  }, [animationCompleted]);

  const parseWinningNumbersFromFeed = (xmlDoc: Document) => {
    try {
      const entries = xmlDoc.querySelectorAll("entry");

      for (const entry of entries) {
        const lotteryNameElement = entry.querySelector("lottery_name");
        const lotteryName = lotteryNameElement?.textContent
          ?.toLowerCase()
          .trim();

        console.log("Lottery Name:", lotteryName);

        if (lotteryName?.includes("mega millions")) {
          const lastDrawResults = entry
            .querySelector("last_draw_results")
            ?.textContent?.split(";")
            .map((number) => parseInt(number.trim()));
          const lastNumber = entry
            .querySelector("last_draw_results")
            ?.textContent?.split("+")
            .pop()
            ?.trim();

          if (lastDrawResults && lastNumber) {
            console.log("Last Draw Results:", [
              ...lastDrawResults,
              parseInt(lastNumber),
            ]);
            return [...lastDrawResults, parseInt(lastNumber)];
          }
        }
      }

      console.log("No Mega Millions data found in the feed.");
      return [];
    } catch (error) {
      console.error("Error parsing XML data:", error);
      return [];
    }
  };

  const handleRandomizeUserNumbers = (randomNumberOfRows: number) => {
    const rows = Array.from({ length: randomNumberOfRows }, () =>
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 99) + 1)
    );
    setUserNumbers(rows);
  };

  return (
    <div className="container text-center">
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
        {animationCompleted && (
          <h3 className="honk-font fs-1 mt-2 show antal-ratt-message">
            Antal Rätt: {matchedNumbers.length}
          </h3>
        )}
      </div>
      <h1 className="honk-font fs-1">Rätt Rad</h1>
      <div className="text-xl animated-winning-numbers ball">
        {winningNumbers.map((number, index) => (
          <span
            key={index}
            className={`animated-winning-number rotate-hor-center`}
          >
            {number}
          </span>
        ))}
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
                      isMatched && animationCompleted && "matched-numbers-row"
                    }`}
                  >
                    {number}
                  </span>
                );
              })}
            </div>
            <div className="matched-count">
              <span className="honk-font fs-1 from-left">
                Antal Rätt:{" "}
                {finalMatchedAnimationCompleted
                  ? finalMatchedNumber !== null
                    ? row.filter((number) =>
                        matchedNumbers.includes(number)
                      ).length
                    : "0"
                  : ""}
              </span>
            </div>
          </div>
          {rowIndex < userNumbers.length - 1 && <hr className="blue-line" />}
        </div>
      ))}
    </div>
  );
};

export default LotteryComparison;
