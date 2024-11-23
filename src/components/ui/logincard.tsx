import React from "react";

interface LoginCardProps {
  children: React.ReactNode;
} 

const LoginCard: React.FC<LoginCardProps> = ({ children }) => {
  return (
    <div className="max-w-sm w-full mx-auto p-6 bg-white shadow-lg rounded-md mt-10">
      {children}
    </div>
  );
};

export default LoginCard;
