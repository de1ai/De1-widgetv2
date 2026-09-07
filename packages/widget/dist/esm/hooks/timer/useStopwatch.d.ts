interface UseStopwatchProps {
    offsetTimestamp: Date;
    autoStart?: boolean;
}
export declare function useStopwatch({ autoStart, offsetTimestamp, }: UseStopwatchProps): {
    start: () => void;
    pause: () => void;
    reset: (offset?: Date, newAutoStart?: boolean) => void;
    isRunning: boolean;
    totalSeconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
};
export {};
