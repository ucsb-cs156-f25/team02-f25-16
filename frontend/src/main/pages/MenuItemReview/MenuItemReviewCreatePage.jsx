import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({ storybook = false }) {
  const objectToAxiosParams = (menuitemreview) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
      itemId: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      stars: menuitemreview.stars,
      dateReviewed: menuitemreview.dateReviewed,
      comments: menuitemreview.comments,
    },
  });

  const onSuccess = (menuitemreview) => {
    toast(
      `New menu item review Created - id: ${menuitemreview.id} itemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} dateReviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreviews/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Menu Item Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
