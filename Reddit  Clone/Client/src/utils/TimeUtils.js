const getTimeDifference = (date1, date2, interval) => {
    /*  Get the difference between two dates
        https://stackoverflow.com/a/544429
    */
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timeSpan = date2 - date1;
    if (isNaN(timeSpan)) return NaN;
    switch (interval) {
        case "years":
            return date2.getFullYear() - date1.getFullYear();
        case "months":
            return (
                date2.getFullYear() * 12 +
                date2.getMonth() -
                (date1.getFullYear() * 12 + date1.getMonth())
            );
        case "weeks":
            return Math.floor(timeSpan / week);
        case "days":
            return Math.floor(timeSpan / day);
        case "hours":
            return Math.floor(timeSpan / hour);
        case "minutes":
            return Math.floor(timeSpan / minute);
        case "seconds":
            return Math.floor(timeSpan / second);
        default:
            return undefined;
    }
};

const getTimeString = (days, hours, minutes, seconds) => {
    let s = "";
    if (days !== 0) {
        s = days !== 1 ? "s ago" : " ago";
        return days + " day" + s;
    } else if (hours !== 0) {
        s = hours !== 1 ? "s ago" : " ago";
        return hours + " hour" + s;
    } else if (minutes !== 0) {
        s = minutes !== 1 ? "s ago" : " ago";
        return minutes + " minute" + s;
    } else {
        s = seconds !== 1 ? "s ago" : " ago";
        return seconds + " second" + s;
    }
};

const getCurrentTime = () => {
    let dateObject = new Date();

    let date = ("0" + dateObject.getDate()).slice(-2);
    let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    let year = dateObject.getFullYear();
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let seconds = dateObject.getSeconds();

    // Same format as Backend
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
};

const TimeUtils = {
    timeDifference(postDate) {
        const currentTime = getCurrentTime();

        let days = getTimeDifference(postDate, currentTime, "days");
        let hours = getTimeDifference(postDate, currentTime, "hours");
        let minutes = getTimeDifference(postDate, currentTime, "minutes");
        let seconds = getTimeDifference(postDate, currentTime, "seconds");

        return getTimeString(days, hours, minutes, seconds);
    },
    tokenLife(loginTime) {
        const currentTime = getCurrentTime();
        let minutes = getTimeDifference(loginTime, currentTime, "minutes");
        return minutes;
    },
};

export default TimeUtils;
