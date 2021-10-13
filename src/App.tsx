import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouteMatch } from "react-router-dom";

// @ts-ignore
import { Page } from "@reach/chrome";

import "./styles/common.css";
import "./styles/index.css";
import "./styles/main.css";

import RouterContainer from "./RouterContainer";
import { RootPathProvider } from "./hooks/useRootPath";
import { ServiceNowProvider } from "./hooks/useServiceNowUser";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function App() {
  const match = useRouteMatch();

  return (
    <Page title="My Incident">
      <QueryClientProvider client={queryClient}>
        <RootPathProvider rootPath={match.path}>
          <ServiceNowProvider>
            <RouterContainer />
          </ServiceNowProvider>
        </RootPathProvider>
      </QueryClientProvider>
    </Page>
  );
}
