import React, { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([]);

  function transition(newMode, replace = false) {
    if (replace) {
      history.pop();
      history.push(newMode);
      setMode(newMode);      
    } else {
      history.push(newMode);
      setMode(newMode);    
    }

  };

  function back() {
   if (history.length > 1) {
     setMode(history[history.length - 2])
     history.pop();
   } else {
     setMode(initial);
   }
  };

  return { mode, transition, back };
};