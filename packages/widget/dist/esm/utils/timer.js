export const formatTimer = ({ days = 0, hours = 0, minutes = 0, seconds = 0, locale = 'en', }) => {
    if (typeof Intl.DurationFormat === 'function') {
        return new Intl.DurationFormat(locale, {
            style: 'digital',
            hours: '2-digit',
            hoursDisplay: 'auto',
        }).format({
            days,
            hours,
            minutes,
            seconds,
        });
    }
    return '';
};
//# sourceMappingURL=timer.js.map