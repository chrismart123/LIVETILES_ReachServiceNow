import React from "react";
import { useState } from "react";
export interface ModalCheckProps {}

function ModalCheck(props: ModalCheckProps) {
  return (
    <div className="w-100 h-100px my-10px px-10px py-4 border border-gray-400 shadow">
      <span className="self-center text-15px">
        You do not have a ServiceNow account. Please contact your administrator
        for further details!
      </span>
      <button className="flex w-24 h-40px mt-20px justify-center items-center self-end">
        <span className="self-center text-15px">Ok</span>
      </button>
    </div>
  );
}

export default ModalCheck;

