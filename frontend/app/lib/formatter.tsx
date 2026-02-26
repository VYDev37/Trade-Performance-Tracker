const Formatter = {
    toLocale(num: number | any): string {
        if (typeof num !== "number")
            return "-";

        return num === 0 ? "-" : num.toLocaleString("id-ID", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    },

    toCurrency(num: number | any): string {
        if (typeof num !== "number")
            return "-";

        return num === 0 ? "-" : num.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 2, minimumFractionDigits: 0 });
    },
    toDate(date: Date): string {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleString("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta", timeStyle: "short", hour12: false });
    }
}

export default Formatter;