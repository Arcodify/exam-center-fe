import React from "react";
import { useRealNetworkStatus } from "../hooks/useRealNetworkStatus";
import "../index.css"; // Make sure you have styles for .offline-flash or .offline-banner

const NetworkStatusWrapper = ({ children }) => {
  const isOnline = useRealNetworkStatus(10000); // 10s interval

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          ⚠️ You're offline. Some features may not work.
        </div>
      )}
      {children}
    </div>
  );
};

export default NetworkStatusWrapper;
