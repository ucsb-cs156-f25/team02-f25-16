import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { Navigate, useParams } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesEditPage({ storybook = false }) {
  const { id } = useParams();

  const {
    data: article,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : rely on react-query caching for GET
    [`/api/articles?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, mutating this adds no value
      method: "GET",
      url: "/api/articles",
      params: { id },
    },
  );

  const objectToAxiosPutParams = (article) => ({
    url: "/api/articles",
    method: "PUT",
    params: {
      id: article.id,
    },
    data: {
      title: article.title,
      url: article.url,
      explanation: article.explanation,
      submitterEmail: article.submitterEmail,
      dateAdded: article.dateAdded,
    },
  });

  const onSuccess = (article) => {
    toast(`Article Updated - id: ${article.id} title: ${article.title}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : mutation invalidates cached article detail
    [`/api/articles?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/articles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Article</h1>
        {article && (
          <ArticlesForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={article}
          />
        )}
      </div>
    </BasicLayout>
  );
}
