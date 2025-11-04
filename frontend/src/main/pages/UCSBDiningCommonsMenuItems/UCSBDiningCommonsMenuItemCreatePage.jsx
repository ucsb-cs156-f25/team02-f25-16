import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({ storybook = false }) {
  const objectToAxiosParams = (UCSBDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitems/post",
    method: "POST",
    params: {
      diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
      name: UCSBDiningCommonsMenuItem.name,
      station: UCSBDiningCommonsMenuItem.station,
    },
  });

  const onSuccess = (UCSBDiningCommonsMenuItem) => {
    toast(
      `New UCSBDiningCommonsMenuItem Created - id: ${UCSBDiningCommonsMenuItem.id} diningCommonsCode: ${UCSBDiningCommonsMenuItem.diningCommonsCode}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbdiningcommonsmenuitems/all"], // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New UCSBDiningCommonsMenuItem</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
