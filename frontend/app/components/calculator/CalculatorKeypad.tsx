import { Button } from "@/components/ui/button";

interface CalculatorKeypadProps {
  display: string;
  storedValue: number | null;
  operator: string | null;
  clear: () => void;
  toggleSign: () => void;
  inputPercent: () => void;
  performOperation: (op: string) => void;
  inputDigit: (digit: string) => void;
  inputDot: () => void;
  calculateEqual: () => void;
}

export default function CalculatorKeypad({
  display,
  storedValue,
  operator,
  clear,
  toggleSign,
  inputPercent,
  performOperation,
  inputDigit,
  inputDot,
  calculateEqual,
}: CalculatorKeypadProps) {
  const buttons = [
    { label: display === "0" && !storedValue ? "AC" : "C", onClick: clear, variant: "special" },
    { label: "+/-", onClick: toggleSign, variant: "special" },
    { label: "%", onClick: inputPercent, variant: "special" },
    { label: "÷", onClick: () => performOperation("/"), variant: "op", op: "/" },
    { label: "7", onClick: () => inputDigit("7"), variant: "num" },
    { label: "8", onClick: () => inputDigit("8"), variant: "num" },
    { label: "9", onClick: () => inputDigit("9"), variant: "num" },
    { label: "x", onClick: () => performOperation("*"), variant: "op", op: "*" },
    { label: "4", onClick: () => inputDigit("4"), variant: "num" },
    { label: "5", onClick: () => inputDigit("5"), variant: "num" },
    { label: "6", onClick: () => inputDigit("6"), variant: "num" },
    { label: "-", onClick: () => performOperation("-"), variant: "op", op: "-" },
    { label: "1", onClick: () => inputDigit("1"), variant: "num" },
    { label: "2", onClick: () => inputDigit("2"), variant: "num" },
    { label: "3", onClick: () => inputDigit("3"), variant: "num" },
    { label: "+", onClick: () => performOperation("+"), variant: "op", op: "+" },
    { label: "0", onClick: () => inputDigit("0"), variant: "num", className: "col-span-2 px-8 flex justify-start" },
    { label: ".", onClick: inputDot, variant: "num" },
    { label: "=", onClick: calculateEqual, variant: "equal" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {buttons.map((btn, i) => {
        const isSelectedOp = btn.variant === "op" && operator === btn.op;

        let style = "h-16 md:h-20 rounded-2xl transition-all shadow-sm active:scale-95 ";
        switch (btn.variant) {
          case "num": {
            style += "bg-gray-800 hover:bg-gray-700 text-white text-xl font-medium border-none";
            break;
          }
          case "special": {
            style += "bg-gray-700/80 hover:bg-gray-600 text-white text-lg font-semibold";
            break;
          }
          case "op": {
            style += isSelectedOp
              ? "bg-white text-blue-600 text-3xl font-medium"
              : "bg-blue-600 hover:bg-blue-500 text-white text-3xl font-medium";
            break;
          }
          case "equal": {
            style += "bg-blue-600 hover:bg-blue-500 text-white text-3xl font-medium";
            break;
          }
        }

        return (
          <Button key={i} onClick={btn.onClick} className={`${style} ${btn.className || ""}`}>
            {btn.label}
          </Button>
        );
      })}
    </div>
  );
}