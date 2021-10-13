import React, { createContext, useContext, useState } from "react";
import { ServiceNowUser } from "../services/types.interface";

type ContextType = {
  user?: ServiceNowUser;
  setUser?: (user?: ServiceNowUser) => void;
};

const ServiceNowContext = createContext<ContextType>({});

export const ServiceNowProvider = ({ children }) => {
  const [user, setUser] = useState<ServiceNowUser>();

  return (
    <ServiceNowContext.Provider value={{ user, setUser }}>
      {children}
    </ServiceNowContext.Provider>
  );
};

export const useServiceNowUser = () => {
  const { user, setUser } = useContext(ServiceNowContext);

  return {
    snUser: user,
    setSNUser: setUser,
  };
};
