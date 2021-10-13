import React, { FC, useEffect, useReducer } from "react";
import { useState } from "react";
import { useGetIncidentsQuery } from "../../services/queries/useGetIncidentsQuery";
import { Container } from "../../components/Container";
import { AppRoute } from "../../helpers/routes";
import PlusCircleSVG from "../../icons/PlusCircleSVG";
import SearchInput from "./SearchInput";
import moment from "moment";
import { IncidentEntity, UrgencyEnum } from "../../services/types.interface";
import Loading from "../../components/Loading";
import AppLink from "../../components/AppLink";
import { useServiceNowUser } from "../../hooks/useServiceNowUser";

import '../../css/dev.css';

interface QueryParams {
  offset: number;
  search?: string;
}

export const Incidents: FC = () => {
  const { snUser: user } = useServiceNowUser();
  const [hasMore, setHasMore] = useState(true);

  const [{ offset, search }, setQuery] = useReducer(
    (s: QueryParams, n: Partial<QueryParams>) => ({ ...s, ...n }),
    {
      offset: 0,
    }
  );

  const [incidents, setIncidents] = useState<IncidentEntity[]>([]);

  console.log('incidents', incidents);


  useEffect(() => {
    setIncidents([]);
    setQuery({ offset: 0 });
    setHasMore(true);
  }, [search]);

  const { isLoading } = useGetIncidentsQuery(
    {
      opened_by: user?.sys_id || "",
      sysparm_offset: offset,
      search,
    },
    {
      onSuccess: (data) => {
        if (data.length < 10) {
          setHasMore(false);
        }

        setIncidents((inc) => [
          ...inc.filter((i) => !data.find((d) => d.sys_id === i.sys_id)),
          ...data,
        ]);
      },
    }
  );

  useEffect(() => {
    document
      .querySelector(".page-content-container")
      .addEventListener("scroll", scrollTracking);

    return () => {
      document
        .querySelector(".page-content-container")
        .removeEventListener("scroll", scrollTracking);
    };
  }, [offset, hasMore, isLoading]);

  function isBottom(el: Element) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  const scrollTracking = () => {
    const el = document.getElementById("incident-scroll-container-test");

    if (isBottom(el)) {
      !isLoading && hasMore && setQuery({ offset: offset + 10 });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <div className="flex items-center py-10px">
        <div className="flex-grow">
          <SearchInput
            value={search}
            onChange={(e) => setQuery({ search: e.target.value })}
          />
        </div>
        <div className="pr-2 pl-4">
          <AppLink
            to={AppRoute.new}
            className="text-gray-500 cursor-pointer hover:text-black fill-current"
          >
            <PlusCircleSVG width={20} height={20} />
          </AppLink>
        </div>
      </div>
      
      <div className="ms-Grid">
        <div className="ms-Grid-row ms-hiddenLgDown">
          {incidents?.map((item) => (
        
            <AppLink key={item.sys_id} to={AppRoute.detail(item.sys_id)} className="incidentBoxLink ms-Grid-col ms-sm4 ">
              <div className="my-10px px-10px py-4 border border-gray-400 shadow rounded-sm cursor-pointer bg-white incidentBox">
                <div className="flex items-center justify-between firstContentBox">
                  <div className="mt-2 text-sm shortDesc">{item.short_description}  <span className="text-gray-600 text-xs">#{item.number}</span></div>
                </div>
                <div className="clearfix"></div>
                <div className="flex items-center justify-between createdBox">
                  <div className="mt-1">
                    <span className="text-xs text-gray-300">Created</span>
                    <span className="text-xs inline-block ml-2">
                      {moment
                        .utc(item.opened_at, "YYYY-MM-DD HH:mm:ss")
                        .local()
                        .format("MMM-DD-YYYY HH:mm:ss")}
                    </span>
                    <div className="clearfix"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between descContent">
                  <span>{item.description} </span>
                </div>
                
                <div className="clearfix"></div>
                <div className="flex items-center justify-between buttonsBelow">
                  <div
                    className={`flex items-center space-x-2 text-xs rounded-sm ${item.urgency === UrgencyEnum.HIGH
                        ? "text-red-800 bg-grey-400"
                        : item.urgency === UrgencyEnum.MEDIUM
                          ? "text-yellow-800 bg-grey-400"
                          : "text-blue-800 bg-grey-400"
                      }`}
                    
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item.urgency === UrgencyEnum.HIGH
                          ? "bg-red-800"
                          : item.urgency === UrgencyEnum.MEDIUM
                            ? "bg-yellow-800"
                            : "bg-blue-800"
                        }`}
                    />
                    <div>
                      {item.urgency === UrgencyEnum.HIGH
                        ? "High"
                        : item.urgency === UrgencyEnum.MEDIUM
                          ? "Medium"
                          : "Low"}
                    </div>
                  </div>
                  <div className=" flex space-x-2 items-center">
                    <div className="text-xs text-black bg-grey-400">
                      <div className="ms-TooltipHost base-sidebar-item-icon base-sidebar-item-icon-primary root-51" >
                        <i data-icon-name="People" aria-hidden="true" className="root-63"></i>
                      </div> 
                      Assigned to </div>
                    {item.assigned_to && (
                      <div className="space-x-1 flex items-center">
                      
                        <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-white text-xs uppercase">
                            {item.assigned_to.display_value
                              .split(" ")
                              .map((item) => item[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.assigned_to.display_value}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-600 text-xs bg-grey-400">
                    Open
                  </div>
                </div>
                <div className="clearfix"></div>

              </div>
            </AppLink>
            
            
          ))}
        </div>

        <div className="ms-Grid-row ms-hiddenXlUp">
          {incidents?.map((item) => (
        
            <AppLink key={item.sys_id} to={AppRoute.detail(item.sys_id)} className="incidentBoxLink ms-Grid-col ms-sm12 ">
              <div className="my-10px px-10px py-4 border border-gray-400 shadow rounded-sm cursor-pointer bg-white incidentBox">
                <div className="flex items-center justify-between firstContentBox">
                  <div className="mt-2 text-sm shortDesc">{item.short_description}  <span className="text-gray-600 text-xs">#{item.number}</span></div>
                </div>
                <div className="clearfix"></div>
                <div className="flex items-center justify-between createdBox">
                  <div className="mt-1">
                    <span className="text-xs text-gray-300">Created</span>
                    <span className="text-xs inline-block ml-2">
                      {moment
                        .utc(item.opened_at, "YYYY-MM-DD HH:mm:ss")
                        .local()
                        .format("MMM-DD-YYYY HH:mm:ss")}
                    </span>
                    <div className="clearfix"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between descContent">
                  <span>{item.description} </span>
                </div>
                
                <div className="clearfix"></div>
                <div className="flex items-center justify-between buttonsBelow">
                  <div
                    className={`flex items-center space-x-2 text-xs rounded-sm ${item.urgency === UrgencyEnum.HIGH
                        ? "text-red-800 bg-grey-400"
                        : item.urgency === UrgencyEnum.MEDIUM
                          ? "text-yellow-800 bg-grey-400"
                          : "text-blue-800 bg-grey-400"
                      }`}
                    
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item.urgency === UrgencyEnum.HIGH
                          ? "bg-red-800"
                          : item.urgency === UrgencyEnum.MEDIUM
                            ? "bg-yellow-800"
                            : "bg-blue-800"
                        }`}
                    />
                    <div>
                      {item.urgency === UrgencyEnum.HIGH
                        ? "High"
                        : item.urgency === UrgencyEnum.MEDIUM
                          ? "Medium"
                          : "Low"}
                    </div>
                  </div>
                  <div className=" flex space-x-2 items-center">
                    <div className="text-xs text-black bg-grey-400">
                      <div className="ms-TooltipHost base-sidebar-item-icon base-sidebar-item-icon-primary root-51" >
                        <i data-icon-name="People" aria-hidden="true" className="root-63"></i>
                      </div> 
                      Assigned to </div>
                    {item.assigned_to && (
                      <div className="space-x-1 flex items-center">
                      
                        <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-white text-xs uppercase">
                            {item.assigned_to.display_value
                              .split(" ")
                              .map((item) => item[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.assigned_to.display_value}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-600 text-xs bg-grey-400">
                    Open
                  </div>
                </div>
                <div className="clearfix"></div>

              </div>
            </AppLink>
            
            
          ))}
        </div>
      </div>
      
    

      {isLoading && (
        <div className="my-20px">
          <Loading />
        </div>
      )}
    </Container>
  );
};


