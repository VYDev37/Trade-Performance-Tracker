import Calculator from "@/app/components/calculator/Calculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator | Trade Performance Tracker",
  description: "A functional calculator for trading calculations",
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-col gap-8 w-full p-6 text-white min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calculator</h1>
        <p className="text-gray-400">Perform quick arithmetic calculations without leaving your dashboard.</p>
      </div>
      <div className="flex justify-center items-center flex-1 pb-20">
        <Calculator />
      </div>
    </div>
  );
}
