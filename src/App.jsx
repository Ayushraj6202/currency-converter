import { useState,useEffect } from "react";

function App() {
  const [amount,setAmount] = useState(1);
  const [from,setFrom] = useState("USD");
  const [to,setTo] = useState("INR");
  const [convertedAmount,setConvertedAmount] = useState(0);
  const [data,setData] = useState({ date: Date() });
  const [options,setOptions] = useState(["USD","INR"]);
  const obj = {
    "USD": "United States Dollar",
    "INR": "Indian Rupee"
  };
  const [fullname,setFullname] = useState(obj);

  const fetchAllName = async () => {
    try {
      const response = await fetch(
        "https://openexchangerates.org/api/currencies.json"
      );
      const result = await response.json();
      const allName = Object.keys(result);
      setFullname(result);
      setOptions(allName);
    } catch {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchAllName();
  },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${from}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:",error);
      }
    };
    fetchData();
  },[from]);


  useEffect(() => {
    if (data && data.base === from) {
      setConvertedAmount((amount * data["rates"][to]).toFixed(2));
    } else {
      setConvertedAmount(0);
    }
  },[amount,from,to,data]);

  return (
    <div className="w-full min-h-screen bg-slate-400 flex flex-col items-center p-4">
      <div className="text-white bg-slate-800 rounded-full flex justify-center mt-10 text-3xl p-2 w-full max-w-md text-center">
        Currency Converter
      </div>
      <div className="mb-5 mt-5 bg-gray-200 text-red-950 max-w-md font-bold text-lg text-center">
        {data ? `Last updated on ${data.date}` : `Data is not updated`}
      </div>

      <div className="w-full max-w-md bg-slate-400 flex flex-col gap-4 p-4 rounded-xl">
        <div className="bg-blue-500 flex flex-col p-4 rounded-xl">
          <label htmlFor="From" className="text-xl text-white mb-2">
            {from}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="m-2 rounded-full p-2 text-center"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-full bg-slate-800 text-white p-2"
          >
            {options.map((e) => (
              <option key={e} value={e}>
                {`${e} ${fullname[e]}`}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-500 flex flex-col p-4 rounded-xl">
          <label htmlFor="To" className="text-xl text-white mb-2">
            {to}
          </label>
          <input
            type="number"
            value={convertedAmount}
            readOnly
            className="m-2 rounded-full p-2 text-center"
          />
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-full bg-slate-800 text-white p-2"
          >
            {options.map((e) => (
              <option key={e} value={e}>
                {`${e} ${fullname[e]}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
