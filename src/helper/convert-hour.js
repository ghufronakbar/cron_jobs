export const convertHour = (hour) => {
    const numHour = Number(hour);
    const utcHour = (numHour - 7 + 24) % 24;
    const finalHour = utcHour.toString().padStart(2, '0');
    console.log("BEFORE: ", hour, "AFTER: ", finalHour);
    return finalHour;
};