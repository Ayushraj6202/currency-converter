import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [Data, setData] = useState({ date: Date() });
  const [options, setoptions] = useState(["USD", "INR"]);
  const obj={
    "USD":"United states",
    "INR":"Indian Rupees"
  }
  const [fullname,setFullname] = useState(obj);
  const fetchAllName = async () => {
    try {
      const response = await fetch(
        "https://openexchangerates.org/api/currencies.json"
      );
      const result = await response.json();
      const AllName = Object.keys(result);
      // const FullName = Object.values(result);
      setFullname(result)
      setoptions(AllName);
    } catch {
      console.error("Error fetching data");
    }
  };
  fetchAllName();
  // console.log(fullname);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${from}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [amount, from, to, setConvertedAmount,setData]);

  useEffect(() => {
    if (Data && Data.base == from) {
      console.log(Number(amount) * Number(Data["rates"][to]));
      setConvertedAmount(amount * Data["rates"][to]);
    } else {
      setConvertedAmount(0);
    }
  }, [amount, from, to, convertedAmount,Data]);

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="text-white bg-orange-700 rounded-full flex justify-center mt-10 text-4xl p-2 w-1/2">
          Currency Converter
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mb-5 mt-5 bg-gray-200 text-red-950 max-w-5xl font-bold text-l text-center">
          {Data ? `Last updated on ${Data.date}` : `Wait data is not updated`}
        </div>
      </div>

      <div className="w-full h-[100px] bg-slate-400 flex justify-center rounded-full gap-5">
        
        
        <div className="bg-blue-500 flex items-center rounded-full p-3 gap-2">
          <label htmlFor="From" className="text-xl">
            {from}
          </label>
          <input
            type="Number"
            value={amount}
            className="m-3 rounded-full  p-2"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <select
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
            className="rounded-full bg-orange-500 h-8 p-1"
          >
            {options.map((e) => (
              <option key={e} value={e}>
                {" "}
                {`${e} ${fullname[e]}`}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-500 flex items-center rounded-full p-3 gap-2">
          <label htmlFor="to" className="text-xl">
            {to}
          </label>
          <input
            type="Number"
            value={convertedAmount}
            readOnly
            className="m-3 rounded-full p-2 "
          />
          <select
            value={to}
            className="rounded-full bg-orange-500 h-8 p-1 "
            onChange={(e) => {
              setTo(e.target.value);
            }}
          >
            {options.map((e) => (
              <option key={e} value={e}>
                {" "}
                {`${e} ${fullname[e]}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default App;
