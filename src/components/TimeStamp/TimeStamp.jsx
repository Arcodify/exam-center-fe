import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTimeByMs } from "../../utils";

const defaultCountdown = {
  hours: "00",
  minutes: "00",
  seconds: "00",
};

function TimeStamp() {
  const [countDown, setCountDown] = useState(defaultCountdown);
  const [startTime, setStartTime] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an end time in localStorage
    const savedEndTime = localStorage.getItem("endTime");

    let endTime;
    if (savedEndTime) {
      endTime = parseInt(savedEndTime, 10);
    } else {
      endTime = new Date().getTime() + 30 * 60000; 
      localStorage.setItem("endTime", endTime); // Save to localStorage
    }

    return () => {
      // Don't remove it here if you want the timer to persist
      // localStorage.removeItem("endTime");
    };
  }, []); 

  useEffect(() => {
    const savedEndTime = localStorage.getItem("endTime");
    if (!savedEndTime) return;

    const totalTime = parseInt(savedEndTime, 10);

    let intervalId;
    if (startTime && totalTime) {
      intervalId = setInterval(() => {
        const timeNext = getTimeByMs(totalTime);

        if (timeNext) {
          setCountDown(timeNext);
        } else {
          clearInterval(intervalId);
          setStartTime(false);
          navigate("/finish");
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime, navigate]);

  return (
    <div className="flex max-w-fit items-center space-x-3 text-2xl text-red-600 font-semibold">
      <span>{countDown.hours} :</span>
      <span>{countDown.minutes} :</span>
      <span>{countDown.seconds}</span>
    </div>
  );
}

export default TimeStamp;
