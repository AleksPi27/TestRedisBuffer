export function getTimeoutLimit(): number{
    const limitMs = process.env.MAX_TIME_BUFFER_INTERVAL;
    return parseInt(limitMs)*1000;
}

export function getAppPort(): number {
    const port = process.env.PORT || "3000";
    return parseInt(port);
}

export function getSizeLimit(): number {
    const size = process.env.MAX_BUFFER_SIZE;
    return parseInt(size);
}
