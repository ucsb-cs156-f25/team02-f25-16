import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: UCSBDiningCommonsMenuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitems?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitems`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (UCSBDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitems",
    method: "PUT",
    params: {
      id: UCSBDiningCommonsMenuItem.id,
    },
    data: {
      diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
      name: UCSBDiningCommonsMenuItem.name,
      station: UCSBDiningCommonsMenuItem.station,
    },
  });

  const onSuccess = (UCSBDiningCommonsMenuItem) => {
    toast(`UCSBDiningCommonsMenuItem Updated - id: ${UCSBDiningCommonsMenuItem.id} diningCommonsCode: ${UCSBDiningCommonsMenuItem.diningCommonsCode}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonsmenuitems?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBDiningCommonsMenuItems" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>
        {UCSBDiningCommonsMenuItem && (
          <UCSBDiningCommonsMenuItemForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={UCSBDiningCommonsMenuItem}
          />
        )}
      </div>
    </BasicLayout>
  );
}
