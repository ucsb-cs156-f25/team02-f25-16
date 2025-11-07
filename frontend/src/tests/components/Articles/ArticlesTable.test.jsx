import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesTable tests", () => {
  const expectedHeaders = [
    "ID",
    "Title",
    "URL",
    "Explanation",
    "Submitter Email",
    "Date Added",
  ];

  const expectedFields = [
    "id",
    "title",
    "url",
    "explanation",
    "submitterEmail",
    "dateAdded",
  ];

  const testId = "ArticlesTable";
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    vi.clearAllMocks();
  });

  const renderTable = (currentUser, articles = []) => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  test("renders empty table correctly", () => {
    renderTable(currentUserFixtures.userOnly, []);

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.queryByTestId(`${testId}-cell-row-0-col-${field}`),
      ).not.toBeInTheDocument();
    });
  });

  test("renders data correctly for admin", async () => {
    renderTable(currentUserFixtures.adminUser, articlesFixtures.threeArticles);

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("renders data without edit/delete for ordinary user", () => {
    renderTable(currentUserFixtures.userOnly, articlesFixtures.threeArticles);

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", () => {
    renderTable(currentUserFixtures.adminUser, articlesFixtures.threeArticles);

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/articles/edit/1");
  });

  test("Delete button calls delete callback", async () => {
    axiosMock.onDelete("/api/articles").reply(200, {
      message: "Article with id 1 was deleted",
    });

    renderTable(currentUserFixtures.adminUser, articlesFixtures.threeArticles);

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });

    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
