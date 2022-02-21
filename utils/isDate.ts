export function isValidDate(date: Date | undefined | null) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        return true;
    }

    return false;
}
