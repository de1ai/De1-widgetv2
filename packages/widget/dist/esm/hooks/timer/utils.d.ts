export declare function getTimeFromSeconds(secs: number): {
    totalSeconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
};
export declare function getSecondsFromExpiry(expiry: Date, shouldRound?: boolean): number;
export declare function getSecondsFromPrevTime(prevTime: Date, shouldRound?: boolean): number;
export declare function validateExpiryTimestamp(expiryTimestamp: Date): boolean;
export declare function validateOnExpire(onExpire: () => void): boolean;
export declare function getDelayFromExpiryTimestamp(expiryTimestamp: Date, defaultDelay: number): number;
