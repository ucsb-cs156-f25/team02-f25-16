import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestsTable from "main/components/HelpRequests/HelpRequestsTable";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";

export default function HelpRequestsIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: helpRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/helpRequests/all"],
    { method: "GET", url: "/api/helpRequests/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/help-requests/create"
          style={{ float: "right" }}
        >
          Create Help Request
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Help Requests</h1>
        <HelpRequestsTable helpRequests={helpRequests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
