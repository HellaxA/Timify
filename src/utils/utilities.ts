export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"

    }
    return date.toLocaleDateString("en-GB", options);
}
export function getLongMonth(date: Date) {
    return date.toLocaleString('default', { month: 'long' });
}
export function get2DigitMonth(date: Date) {
    return date.toLocaleString('default', { month: '2-digit' });
}
export function get4DigitYear(date: Date) {
    return date.toLocaleString('default', { year: 'numeric' });
}