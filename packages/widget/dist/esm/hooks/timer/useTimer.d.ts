interface UseTimerProps {
    expiryTimestamp: Date;
    onExpire: () => void;
    autoStart?: boolean;
}
export declare function useTimer({ expiryTimestamp: expiry, onExpire, autoStart, }: UseTimerProps): {
    start: () => void;
    pause: () => void;
    resume: () => void;
    restart: (newExpiryTimestamp: Date, newAutoStart?: boolean) => void;
    isRunning: boolean;
    totalSeconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
};
export {};
