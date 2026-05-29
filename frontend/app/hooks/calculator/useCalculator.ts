import { useState } from "react";

export default function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
    setStoredValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const erase = () => {
    if (waitingForNewValue) return;
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay === "-" ? "0" : newDisplay);
    } else {
      setDisplay("0");
    }
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (storedValue == null) {
      setStoredValue(inputValue);
      setEquation(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      const currentValue = storedValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case "+": {
          newValue = currentValue + inputValue;
          break;
        }
        case "-": {
          newValue = currentValue - inputValue;
          break;
        }
        case "*": {
          newValue = currentValue * inputValue;
          break;
        }
        case "/": {
          newValue = currentValue / inputValue;
          break;
        }
      }

      setStoredValue(newValue);
      setDisplay(String(newValue));
      setEquation(`${newValue} ${nextOperator}`);
    } else {
      setEquation(`${inputValue} ${nextOperator}`);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const calculateEqual = () => {
    if (!operator || storedValue == null)
      return;

    const inputValue = parseFloat(display);
    let newValue = storedValue;

    switch (operator) {
      case "+": {
        newValue = storedValue + inputValue;
        break;
      }
      case "-": {
        newValue = storedValue - inputValue;
        break;
      }
      case "*": {
        newValue = storedValue * inputValue;
        break;
      }
      case "/": {
        newValue = storedValue / inputValue;
        break;
      }
    }

    setDisplay(String(newValue));
    setEquation("");
    setStoredValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  return {
    display,
    equation,
    storedValue,
    operator,
    inputDigit,
    inputDot,
    clear,
    erase,
    inputPercent,
    performOperation,
    calculateEqual
  };
}
