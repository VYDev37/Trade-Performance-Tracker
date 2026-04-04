"use client";

import { useCalculator } from "@/app/hooks";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeypad from "./CalculatorKeypad";

export default function Calculator() {
  const calculator = useCalculator();

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-5 flex flex-col gap-4">
      <CalculatorDisplay
        equation={calculator.equation}
        display={calculator.display}
      />
      <CalculatorKeypad
        display={calculator.display}
        storedValue={calculator.storedValue}
        operator={calculator.operator}
        clear={calculator.clear}
        toggleSign={calculator.toggleSign}
        inputPercent={calculator.inputPercent}
        performOperation={calculator.performOperation}
        inputDigit={calculator.inputDigit}
        inputDot={calculator.inputDot}
        calculateEqual={calculator.calculateEqual}
      />
    </div>
  );
}
