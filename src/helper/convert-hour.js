export const convertHour = (hour) => {
    const numHour = Number(hour);
    const utcHour = (numHour - 7 + 24) % 24;
    return utcHour.toString().padStart(2, '0');
};