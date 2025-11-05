import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RestaurantRecommendation/RecommendationRequestTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import { useBackend } from "main/utils/useBackend";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();
  const showCreateButton = hasRole(currentUser, "ROLE_ADMIN");

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : React Query caching behaviour
    ["/api/recommendationrequests/all"],
    { method: "GET", url: "/api/recommendationrequests/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {showCreateButton ? (
          <Button
            variant="primary"
            href="/recommendationrequest/create"
            style={{ float: "right" }}
            data-testid="RecommendationRequestIndexPage-create-button"
          >
            Create RecommendationRequest
          </Button>
        ) : null}
        <h1>Recommendation Requests</h1>
        <RecommendationRequestTable
          recommendationRequests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
