import { jsx as _jsx } from "react/jsx-runtime";
import { useStopwatch } from '../../hooks/timer/useStopwatch.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { formatTimer } from '../../utils/timer.js';
import { TimerContent } from './TimerContent.js';
export const RouteTimer = ({ route }) => {
    const firstActiveStep = route?.steps.find((step) => step.execution);
    const firstActiveProcess = firstActiveStep?.execution?.process.at(0);
    const startTime = new Date(firstActiveProcess?.startedAt ?? Date.now());
    const { seconds, minutes, days, hours } = useStopwatch({
        autoStart: true,
        offsetTimestamp: startTime,
    });
    const { language } = useSettings(['language']);
    return (_jsx(TimerContent, { children: formatTimer({
            days,
            hours,
            seconds,
            minutes,
            locale: language,
        }) }));
};
//# sourceMappingURL=RouteTimer.js.map