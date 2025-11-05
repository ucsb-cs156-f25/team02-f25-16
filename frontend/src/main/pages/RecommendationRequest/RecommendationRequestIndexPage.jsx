import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RestaurantRecommendation/RecommendationRequestTable";
import { Button } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : React Query cache key should remain stable
    ["/api/recommendationrequests/all"],
    {
      // Stryker disable next-line all : GET is the default and mutating to "" doesn't change semantics
      method: "GET",
      url: "/api/recommendationrequests/all",
    },
    [],
  );

  const renderCreateButton = () => {
    if (!hasRole(currentUser, "ROLE_ADMIN")) {
      return null;
    }
    return (
      <Button
        variant="primary"
        href="/recommendationrequest/create"
        style={{ float: "right" }}
        data-testid="RecommendationRequestIndexPage-create-button"
      >
        Create RecommendationRequest
      </Button>
    );
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {renderCreateButton()}
        <h1>Recommendation Requests</h1>
        <RecommendationRequestTable
          recommendationRequests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}

