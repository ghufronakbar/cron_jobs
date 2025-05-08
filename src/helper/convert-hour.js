export const convertHour = (hour) => {
    const numHour = Number(hour)
    const indoHour = (numHour + 7) % 24
    return indoHour.toString().padStart(2, '0')
}