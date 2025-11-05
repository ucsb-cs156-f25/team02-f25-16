import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Title/)).toBeInTheDocument();
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId(/ArticlesForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-submit");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required\./);
    expect(screen.getByText(/URL is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(
      screen.getByText(/Submitter Email is required\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required\./)).toBeInTheDocument();
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-url");
    const titleField = screen.getByTestId("ArticlesForm-title");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const emailField = screen.getByTestId("ArticlesForm-submitterEmail");
    const dateField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Provide valid values for required text fields
    fireEvent.change(titleField, { target: { value: "Some Title" } });
    fireEvent.change(explanationField, {
      target: { value: "Some explanation" },
    });

    // Bad patterns for url/email/date
    fireEvent.change(urlField, { target: { value: "bad-url" } });
    fireEvent.change(emailField, { target: { value: "bad-email" } });
    fireEvent.change(dateField, { target: { value: "bad-date" } });
    fireEvent.click(submitButton);

    await screen.findByText(/URL must start with http\(s\):\/\//);
    expect(screen.getByText(/Email must be valid\./)).toBeInTheDocument();
    // For datetime-local, invalid text becomes empty => required triggers
    expect(screen.getByText(/Date Added is required\./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-submitterEmail");
    const dateField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Chromatic Intro" } });
    fireEvent.change(urlField, {
      target: { value: "https://example.com/article" },
    });
    fireEvent.change(explanationField, {
      target: { value: "A great article" },
    });
    fireEvent.change(emailField, { target: { value: "user@example.com" } });
    fireEvent.change(dateField, { target: { value: "2022-01-02T12:00" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/must be in ISO format/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/must start with http\(s\):\/\//),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-cancel");
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
