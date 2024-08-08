import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Fetch the initial counter value from the backend
    const fetchCounter = async () => {
      try {
        const response = await fetch(`${API_URL}/counter`);
        const data = await response.json();
        setCounter(data.value);
      } catch (err) {
        console.error("Error fetching counter:", err);
      }
    };

    fetchCounter();
  }, []);

  const increment = async () => {
    try {
      const response = await fetch(`${API_URL}/increment`, { method: "POST" });
      const data = await response.json();
      setCounter(data.value);
    } catch (err) {
      console.error("Error incrementing counter:", err);
    }
  };

  const decrement = async () => {
    try {
      const response = await fetch(`${API_URL}/decrement`, { method: "POST" });
      const data = await response.json();
      setCounter(data.value);
    } catch (err) {
      console.error("Error decrementing counter:", err);
    }
  };

  return (
    <div className="app">
      <h1>Counter App</h1>
      <div className="counter-container">
        <button className="counter-button" onClick={decrement}>
          -
        </button>
        <span className="counter-value">{counter}</span>
        <button className="counter-button" onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
};

export default App;
