interface QuantitySliderProps {
    max: number;      // Total lot yang dimiliki (maxLot)
    current: number;  // formData.qty saat ini
    onChange: (value: number) => void;
}

export default function QuantitySlider({ max, current, onChange }: QuantitySliderProps) {
    // Hitung persen berdasarkan nilai qty saat ini vs max
    const percent = max > 0 ? Math.round((current / max) * 100) : 0;
    const marks = [0, 25, 50, 75, 100];

    const handleSliderChange = (p: number) => {
        const newQty = Math.floor((p / 100) * max);
        onChange(newQty);
    };

    return (
        <div className="w-full space-y-4">
            <div className="relative pt-6 pb-2">
                {/* Tooltip Persen yang Mengikuti Thumb (Opsional tapi Keren) */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={percent}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />

                {/* Custom Marks UI (Lebih rapi dari datalist) */}
                <div className="flex justify-between mt-2 px-1">
                    {marks.map((m) => (
                        <div key={m} className="flex flex-col items-center">
                            <div className={`h-1.5 w-0.5 ${percent >= m ? 'bg-blue-500' : 'bg-gray-600'}`} />
                            <span className={`text-[10px] mt-1 ${percent >= m ? 'text-blue-400' : 'text-gray-500'}`}>
                                {m}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2">
                {[25, 50, 75, 100].map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => handleSliderChange(m)}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border transition-all 
              ${percent === m
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {m === 100 ? 'MAX' : `${m}%`}
                    </button>
                ))}
            </div>
        </div>
    );
}