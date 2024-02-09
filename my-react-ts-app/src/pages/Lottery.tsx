import React, { useState, useEffect } from "react";

import "../Styling/Slide-in-top.css";
// import "../Styling/Swirl.css";
// import "../Styling/Rotating-center.css";
// import "../Styling/Bouncing.css";
import "../Styling/Background.css";
import "../Styling/Firework.css";

const LotteryComparison = () => {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<number[][]>([]);
  const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);
  const [numberOfRows, setNumberOfRows] = useState(1);

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
      <h1 className="honk-font fs-1">Vinst Dragningen</h1>
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
        <div key={rowIndex} className="row-numbers mt-1 p-1 mx-auto">
          <div className="user-numbers">
            {row.map((number, index) => (
              <span
                key={index}
                className={`user-number ${
                  matchedNumbers.includes(number) && "matched-numbers-row"
                }`}
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div>
        <h3 className="honk-font fs-1 mt-2">
          Antal Rätt: {matchedNumbers.length}
        </h3>
      </div>
      <div>
        <h3 className="honk-font fs-1 mt-2">
          {matchedNumbers.length > 0
            ? "Grattis! Du vann!"
            : "Tyvärr, inga rätt!"}
        </h3>
      </div>
    </div>
  );
};

export default LotteryComparison;
