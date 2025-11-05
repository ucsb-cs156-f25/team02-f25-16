import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RestaurantRecommendation/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
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

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Requester Email/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input (max length, bad dates)", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    const requesterEmailField = await screen.findByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const submitButton = screen.getByTestId(
      "RecommendationRequestForm-submit",
    );

    // long string to trigger maxLength
    const longText = "x".repeat(300);
    fireEvent.change(requesterEmailField, { target: { value: "user@ucsb.edu" } });
    fireEvent.change(professorEmailField, { target: { value: "prof@ucsb.edu" } });
    fireEvent.change(explanationField, { target: { value: longText } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Max length 255 characters/);
    expect(screen.getAllByText(/Max length 255 characters/).length).toBeGreaterThan(0);
    // date fields use a generic required message for any invalid state
    expect(screen.getByText(/DateRequested is required\./)).toBeInTheDocument();
    expect(screen.getByText(/DateNeeded is required\./)).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const submitButton = await screen.findByTestId(
      "RecommendationRequestForm-submit",
    );

    fireEvent.click(submitButton);

    await screen.findByText(/RequesterEmail is required\./);
    expect(
      screen.getByText(/ProfessorEmail is required\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(screen.getByText(/DateRequested is required\./)).toBeInTheDocument();
    expect(screen.getByText(/DateNeeded is required\./)).toBeInTheDocument();
  });

  test("No Error messages on good input and submitAction called", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    const requesterEmailField = await screen.findByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const doneSwitch = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId(
      "RecommendationRequestForm-submit",
    );

    fireEvent.change(requesterEmailField, { target: { value: "alice@ucsb.edu" } });
    fireEvent.change(professorEmailField, { target: { value: "prof@ucsb.edu" } });
    fireEvent.change(explanationField, { target: { value: "Grad apps" } });
    fireEvent.change(dateRequestedField, {
      target: { value: "2025-01-01T09:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2025-02-01T17:00" },
    });
    fireEvent.click(doneSwitch);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Max length 255 characters/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/is required\./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const cancelButton = await screen.findByTestId(
      "RecommendationRequestForm-cancel",
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
