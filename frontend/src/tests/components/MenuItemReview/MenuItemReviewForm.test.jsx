import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
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

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    await screen.findByText(/Item Id/);
    await screen.findByText(/Reviewer Email/);
    await screen.findByText(/Stars/);
    await screen.findByText(/Date Reviewed/);
    await screen.findByText(/Comments/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email/)).toBeInTheDocument();
    expect(screen.getByText(/Stars/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed/)).toBeInTheDocument();
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm
          initialContents={menuItemReviewFixtures.oneMenuItemReview[0]}
        />
      </Router>,
    );

    await screen.findByTestId(/MenuItemReviewForm-id/);
    expect(screen.getByText(/^Id$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");

    expect(screen.getByText(/^Item Id$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-itemId/)).toHaveValue("1");
    expect(screen.getByText(/^Reviewer Email$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-reviewerEmail/)).toHaveValue(
      "test@test.com",
    );
    expect(screen.getByText(/^Stars$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-stars/)).toHaveValue("1");
    expect(screen.getByText(/^Date Reviewed$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-dateReviewed/)).toHaveValue(
      "2022-01-03T00:00",
    );
    expect(screen.getByText(/^Comments$/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-comments/)).toHaveValue(
      "test comment",
    );
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    await screen.findByTestId("MenuItemReviewForm-itemId");
    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "bad-input" } });
    fireEvent.change(reviewerEmailField, { target: { value: "bad-input" } });
    fireEvent.change(starsField, { target: { value: "bad-input" } });
    fireEvent.change(dateReviewedField, { target: { value: "bad-input" } });
    fireEvent.change(commentsField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Item Id is required/);
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-itemId");

    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "1" } });
    fireEvent.change(reviewerEmailField, {
      target: { value: "test@test.com" },
    });
    fireEvent.change(starsField, { target: { value: "3" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2022-01-03T00:00:00" },
    });
    fireEvent.change(commentsField, { target: { value: "test comment" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/dateReviewed must be in ISO format/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
