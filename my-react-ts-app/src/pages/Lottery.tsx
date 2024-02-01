import React, { useState, useEffect } from "react";

const LotteryComparison = () => {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<number[]>([]);
  const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchWinningNumbers = async () => {
      try {
        const response = await fetch("https://www.thelotter.se/rss.xml?languageid=9");
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
    const matched = userNumbers.filter((number) => winningNumbers.includes(number));
    setMatchedNumbers(matched);
  }, [winningNumbers, userNumbers]);

  const parseWinningNumbersFromFeed = (xmlDoc: Document) => {
    try {
      const entries = xmlDoc.querySelectorAll("entry");
  
      for (const entry of entries) {
        const lotteryNameElement = entry.querySelector("lottery_name");
        const lotteryName = lotteryNameElement?.textContent?.toLowerCase().trim();
  
        console.log("Lottery Name:", lotteryName);
  
        if (lotteryName.includes("mega millions")) {
          const lastDrawResults = entry.querySelector("last_draw_results")?.textContent?.split(';').map((number) => parseInt(number.trim()));
          const lastNumber = entry.querySelector("last_draw_results")?.textContent?.split('+').pop()?.trim();
          
          if (lastDrawResults && lastNumber) {
            console.log("Last Draw Results:", [...lastDrawResults, parseInt(lastNumber)]);
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
  
  
  
  
  
  
  

  return (
    <div>
      <h1 className="text-3xl">Lottery Comparison</h1>
      <p className="text-xl">Winning Numbers: {winningNumbers.join(", ")}</p>
      <p className="text-xl">User Numbers: {userNumbers.join(", ")}</p>
      <p className="text-xl">Matched Numbers: {matchedNumbers.join(", ")}</p>
    </div>
  );
};

export default LotteryComparison;
