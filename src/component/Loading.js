import React from "react";

const Loading = ({ size = "64" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-8 border-blue-500 border-t-transparent`}
        style={{ height: `${size}px`, width: `${size}px` }}
      ></div>
    </div>
  );
};

export default Loading;