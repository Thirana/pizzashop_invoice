import React from "react";

type MessageProps = {
  type: "error" | "success";
  message: string | null;
};

const styles = {
  error:
    "text-red-600 mb-4 text-center bg-red-50 border border-red-200 rounded p-2 text-base",
  success:
    "text-green-700 mb-4 text-center bg-green-50 border border-green-200 rounded p-2 text-base",
};

const Message: React.FC<MessageProps> = ({ type, message }) => {
  if (!message) return null;
  return <div className={styles[type]}>{message}</div>;
};

export default Message; 