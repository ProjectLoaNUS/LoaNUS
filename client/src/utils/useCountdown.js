import { useEffect, useState } from "react";

export const useCountdown = (startTime) => {
    const [time, setTime] = useState(startTime);
    const [intervalID, setIntervalID] = useState(null);
    const hasTimerEnded = time <= 0;
    const isTimerRunning = intervalID != null;

    const update = () => {
        setTime(time => time - 1);
    };
    const startTimer = () => {
        if (!hasTimerEnded && !isTimerRunning) {
            setIntervalID(setInterval(update, 1000));
        }
    };
    const stopTimer = () => {
        clearInterval(intervalID);
        setIntervalID(null);
    };
    const resetTimer = () => {
        if (!hasTimerEnded) {
            stopTimer();
        }
        setTime(startTime);
    };
    // clear interval when the timer ends
    useEffect(() => {
        if (hasTimerEnded) {
            clearInterval(intervalID);
            setIntervalID(null);
        }
    }, [hasTimerEnded]);
    // reset timer once the countdown ends
    useEffect(() => {
        if (!isTimerRunning) {
            resetTimer();
        }
    }, [isTimerRunning]);
    // clear interval when component unmounts
    useEffect(() => () => {
        clearInterval(intervalID);
    }, []);
    return {
        time,
        startTimer,
        stopTimer,
        resetTimer,
        isTimerRunning
    };
};