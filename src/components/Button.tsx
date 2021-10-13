import React from "react";
import Loading from "./Loading";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean;
}

function Button({
  className,
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`border w-24 h-40px mt-20px flex justify-center items-center self-end rounded-sm mr-10px cursor-pointer space-x-1 ${className} ${
        disabled ? "border-gray-300" : "border-gray-500"
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div style={{ transform: "scale(0.5) translateY(8px)" }}>
          <Loading />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
