import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuItemReview,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreviews?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreviews`,
      params: { id },
    },
  );

  const objectToAxiosPutParams = (menuitemreview) => ({
    url: "/api/menuitemreviews",
    method: "PUT",
    params: { id: menuitemreview.id },
    data: {
      itemId: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      stars: menuitemreview.stars,
      dateReviewed: menuitemreview.dateReviewed,
      comments: menuitemreview.comments,
    },
  });

  const onSuccess = (_response, menuitemreview) => {
    toast(
      `MenuItemReview Updated - id: ${menuitemreview.id} itemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} dateReviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreviews?id=${id}`],
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
        <h1>Edit Menu Item Review</h1>
        {menuItemReview && (
          <MenuItemReviewForm
            initialContents={menuItemReview}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
