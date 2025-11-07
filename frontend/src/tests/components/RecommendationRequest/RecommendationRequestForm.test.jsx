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
  const testId = "RecommendationRequestForm";
  const expectedHeaders = [
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested (iso)",
    "Date Needed (iso)",
  ];
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );
    await screen.findByTestId(`${testId}-id`);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
    // common fields present
    expect(screen.getByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-professorEmail`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateRequested`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateNeeded`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("Max length validations on text fields", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    const requesterEmailField = await screen.findByTestId(
      `${testId}-requesterEmail`,
    );
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const explanationField = screen.getByTestId(`${testId}-explanation`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    const longText = "a".repeat(256);
    fireEvent.change(requesterEmailField, { target: { value: longText } });
    fireEvent.change(professorEmailField, { target: { value: longText } });
    fireEvent.change(explanationField, { target: { value: longText } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const msgs = screen.getAllByText(/Max length 255 characters/);
      expect(msgs.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("Correct Error messages on bad input (max length, bad dates)", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    const requesterEmailField = await screen.findByTestId(
      `${testId}-requesterEmail`,
    );
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const explanationField = screen.getByTestId(`${testId}-explanation`);
    const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    // long string to trigger maxLength
    const longText = "x".repeat(300);
    fireEvent.change(requesterEmailField, {
      target: { value: "user@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationField, { target: { value: longText } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Max length 255 characters/);
    expect(
      screen.getAllByText(/Max length 255 characters/).length,
    ).toBeGreaterThan(0);
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
    const submitButton = await screen.findByTestId(`${testId}-submit`);

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
      `${testId}-requesterEmail`,
    );
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const explanationField = screen.getByTestId(`${testId}-explanation`);
    const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(requesterEmailField, {
      target: { value: "alice@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationField, { target: { value: "Grad apps" } });
    fireEvent.change(dateRequestedField, {
      target: { value: "2025-01-01T09:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2025-02-01T17:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Max length 255 characters/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/is required\./)).not.toBeInTheDocument();
  });

  test("Accepts ISO with seconds (alt 2)", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    const requesterEmailField = await screen.findByTestId(
      `${testId}-requesterEmail`,
    );
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const explanationField = screen.getByTestId(`${testId}-explanation`);
    const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(requesterEmailField, {
      target: { value: "alice@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationField, { target: { value: "Grad apps" } });
    fireEvent.change(dateRequestedField, {
      target: { value: "2025-01-01T09:00:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2025-02-01T17:00:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  // Note: Fractional seconds aren't reliably supported by html input type="datetime-local" in jsdom,
  // so we do not assert that pattern here; regex mutants are disabled via Stryker comments in the component.

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const cancelButton = await screen.findByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
