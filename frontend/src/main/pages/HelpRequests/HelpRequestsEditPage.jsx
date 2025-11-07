import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestsEditPage({ storybook = false }) {
  const { id } = useParams();

  const {
    data: helpRequest,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/helprequests?id=" + id],
    {
      // Stryker disable next-line all : GET is default, so mutating to "" doesn't change behavior
      method: "GET",
      url: "/api/helprequests",
      params: { id },
    },
  );

  const objectToAxiosPutParams = (hr) => ({
    url: "/api/helprequests",
    method: "PUT",
    params: { id: hr.id },
    data: {
      requesterEmail: hr.requesterEmail,
      teamId: hr.teamId,
      tableOrBreakoutRoom: hr.tableOrBreakoutRoom,
      requestTime: hr.requestTime,
      explanation: hr.explanation,
      solved: hr.solved,
    },
  });

  const onSuccess = (hr) => {
    toast(
      `HelpRequest Updated - id: ${hr.id} requesterEmail: ${hr.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : PUT should invalidate specific request cache
    ["/api/helprequests?id=" + id],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/help-requests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Help Request</h1>
        {helpRequest && (
          <HelpRequestForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={helpRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}
