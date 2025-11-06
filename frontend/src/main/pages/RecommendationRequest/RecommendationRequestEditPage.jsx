import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router";
import RecommendationRequestForm from "main/components/RestaurantRecommendation/RecommendationRequestForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  const { id } = useParams();

  const {
    data: recommendationRequest,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/recommendationrequests?id=" + id],
    {
      // Stryker disable next-line all : GET is default, so mutating to "" doesn't change behavior
      method: "GET",
      url: "/api/recommendationrequests",
      params: { id },
    },
  );

  const objectToAxiosPutParams = (rr) => ({
    url: "/api/recommendationrequests",
    method: "PUT",
    params: { id: rr.id },
    data: {
      requesterEmail: rr.requesterEmail,
      professorEmail: rr.professorEmail,
      explanation: rr.explanation,
      dateRequested: rr.dateRequested,
      dateNeeded: rr.dateNeeded,
    },
  });

  const onSuccess = (rr) => {
    toast(
      `RecommendationRequest Updated - id: ${rr.id} requesterEmail: ${rr.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : PUT should invalidate specific request cache
    ["/api/recommendationrequests?id=" + id],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        {recommendationRequest && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={recommendationRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}
