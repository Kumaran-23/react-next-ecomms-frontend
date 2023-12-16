'use client'
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Alert = () => {
  const message = useSelector((state) => state.alerts.message);
  const type = useSelector((state) => state.alerts.type);

  //return null if no message or no type
  if (!message || !type) {
    return null;
  }

  //return alert if message and type
  return (
    <div className={`alert ${type} shadow-lg w-[550px] mx-auto my-8 text-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-info shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default Alert;