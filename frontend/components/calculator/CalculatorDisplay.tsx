"use client"

interface CalculatorDisplayProps {
  equation: string;
  display: string;
}

export default function CalculatorDisplay({ equation, display }: CalculatorDisplayProps) {
  return (
    <div className="bg-gray-950 rounded-3xl p-6 mb-2 flex flex-col items-end justify-end shadow-inner gap-1 overflow-hidden min-h-[160px] relative">
      <div className="absolute top-4 left-5 flex gap-2 w-full">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div className="text-gray-500 text-base h-6 font-mono tracking-wider overflow-hidden text-right whitespace-nowrap w-full">
        {equation}
      </div>
      <div className="text-6xl font-light text-white overflow-hidden text-right whitespace-nowrap w-full scrollbar-none pb-1 tracking-tight">
        {display}
      </div>
    </div>
  );
}
