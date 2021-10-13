// @ts-ignore
import { useCurrentUser } from "@reach/core";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Loading from "./components/Loading";
import { AppRoute } from "./helpers/routes";
import { useRootPath } from "./hooks/useRootPath";
import { useServiceNowUser } from "./hooks/useServiceNowUser";
import { IncidentDetail } from "./pages/IncidentDetail";
import { Incidents } from "./pages/Incidents";
import InValidPage from "./pages/InValidPage";
import { CreateIncident } from "./pages/NewIncident";
import { useGetUserQuery } from "./services/queries/useGetUserQuery";

export interface RouterContainerProps {}

function RouterContainer(props: RouterContainerProps) {
  const [initial, setInitial] = useState(false);

  const { snUser, setSNUser } = useServiceNowUser();

  const { path } = useRootPath();

  const user = useCurrentUser();

  const { isLoading, error } = useGetUserQuery(user?.mail, {
    onSuccess: (data) => setSNUser(data),
    onSettled: () => setInitial(true),
  });

  if (isLoading) return <Loading />;

  if (!isLoading && initial && (error || !snUser || !user)) {
    return <InValidPage />;
   // return <div> {JSON.stringify(error)} </div>
  }

  return (
    <Switch>
      <Route component={CreateIncident} path={path + AppRoute.new} exact />
      <Route component={Incidents} path={path + AppRoute.list} exact />
      <Route component={IncidentDetail} path={path + AppRoute.detail()} exact />
    </Switch>
  );
}

export default RouterContainer;
