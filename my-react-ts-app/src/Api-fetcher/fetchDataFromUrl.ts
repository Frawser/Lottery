import fetch from "node-fetch";
import url from "url";

interface DataProps {
  drawResult: string;
  customerNumber: string;
  winAmount: string;
  winAmountCurreny: string;
}

const fetchDataFromUrl = async (): Promise<DataProps> => {
  // Example URL to fetch data from
  const urlString =
    "http://betmarket.se/winanimation?drawResult=1;2;14;13;20;42&customerNumber=1;2;12;13;50;42&winAmount=100.00&winAmountCurreny=USD";

  const urlObject = new URL(urlString);

  const drawResult = urlObject.searchParams.get("drawResult");
  const customerNumber = urlObject.searchParams.get("customerNumber");
  const winAmount = urlObject.searchParams.get("winAmount");
  const winAmountCurreny = urlObject.searchParams.get("winAmountCurreny");

  return {
    drawResult: drawResult || "",
    customerNumber: customerNumber || "",
    winAmount: winAmount || "",
    winAmountCurreny: winAmountCurreny || "",
  };
};

export default fetchDataFromUrl;
