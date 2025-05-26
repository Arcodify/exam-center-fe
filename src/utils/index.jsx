import dayjs from "dayjs";

// utils.js
export function getTimeByMs(endTime) {
  if (isNaN(endTime) || endTime <= Date.now()) return null;

  const timeLeftMs = endTime - Date.now();

  const hours = Math.floor((timeLeftMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeftMs / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeftMs / 1000) % 60);

  return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
  };
}


function getSecondByMs(currTime, futTime) {
  const timeDif = futTime.diff(currTime, "second") % 60;
  return timeDif;
}

function getMinuteByMs(currTime, futTime) {
  return futTime.diff(currTime, "minute");
}

// Helper function to convert minutes to HH:MM:SS format
export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60); // Calculate remaining seconds if fractional minutes are provided

  // Format each unit with leading zeros if needed
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(mins).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export function getElapsedTime() {
  const startTime = parseInt(localStorage.getItem("startTime"), 10);
  const now = new Date().getTime();

  if (!startTime) return null;

  const elapsedMs = now - startTime;

  const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, elapsedMs };
}

export function getRemainingTime() {
  const endTime = parseInt(localStorage.getItem("endTime"), 10);
  const now = new Date().getTime();

  if (!endTime) return null;

  const remainingMs = endTime - now;

  const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, remainingMs };
}
