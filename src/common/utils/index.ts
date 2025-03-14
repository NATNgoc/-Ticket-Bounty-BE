function getYesterday(): Date {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    return today;
}
export { getYesterday };