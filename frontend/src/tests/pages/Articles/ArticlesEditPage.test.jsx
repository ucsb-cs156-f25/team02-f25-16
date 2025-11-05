import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 5,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;

describe("ArticlesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 5 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("renders header but form is not present", async () => {
      const queryClient = new QueryClient();
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit Article");
      expect(
        screen.queryByTestId("ArticlesForm-title"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 5 } }).reply(200, {
        id: 5,
        title: "How to deploy Postgres Database",
        url: "https://ucsb-cs156.github.io/topics/dokku/postgres_database.html",
        explanation:
          "Instruction on how to deploy a Postgres database using Dokku",
        submitterEmail: "m_srivastava@ucsb.edu",
        dateAdded: "2022-01-03T00:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "5",
        title: "How to deploy an app on Dokku",
        url: "https://ucsb-cs156.github.io/topics/dokku/deploying_an_app.html",
        explanation: "Instruction on how to deploy an app on Dokku",
        submitterEmail: "m_srivastava@ucsb.edu",
        dateAdded: "2022-02-03T12:30",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("is populated with the data provided and submits updates", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-id");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-submitterEmail");
      const dateField = screen.getByTestId("ArticlesForm-dateAdded");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      expect(idField).toHaveValue("5");
      expect(titleField).toHaveValue("How to deploy Postgres Database");
      expect(urlField).toHaveValue(
        "https://ucsb-cs156.github.io/topics/dokku/postgres_database.html",
      );
      expect(explanationField).toHaveValue(
        "Instruction on how to deploy a Postgres database using Dokku",
      );
      expect(emailField).toHaveValue("m_srivastava@ucsb.edu");
      expect(dateField).toHaveValue("2022-01-03T00:00");
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "How to deploy an app on Dokku" },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://ucsb-cs156.github.io/topics/dokku/deploying_an_app.html",
        },
      });
      fireEvent.change(explanationField, {
        target: { value: "Instruction on how to deploy an app on Dokku" },
      });
      fireEvent.change(dateField, {
        target: { value: "2022-02-03T12:30" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 5 title: How to deploy an app on Dokku",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 5 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "How to deploy an app on Dokku",
          url: "https://ucsb-cs156.github.io/topics/dokku/deploying_an_app.html",
          explanation: "Instruction on how to deploy an app on Dokku",
          submitterEmail: "m_srivastava@ucsb.edu",
          dateAdded: "2022-02-03T12:30",
        }),
      );
    });

    test("changes when you click Update", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-id");

      const titleField = screen.getByTestId("ArticlesForm-title");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const submitButton = screen.getByTestId("ArticlesForm-submit");

      fireEvent.change(titleField, {
        target: { value: "How to deploy an app on Dokku" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Instruction on how to deploy an app on Dokku" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 5 title: How to deploy an app on Dokku",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });
    });
  });
});
