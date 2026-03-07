export function formatNumber(number) {
    if (number === undefined || number === null) return "0";

    const num = Number(number);
    if (isNaN(num)) return "0";

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
