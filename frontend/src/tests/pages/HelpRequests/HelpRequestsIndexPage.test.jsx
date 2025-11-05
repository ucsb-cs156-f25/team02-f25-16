import { render, screen, waitFor } from "@testing-library/react";
import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("HelpRequestsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders Help Requests table for regular user without create button", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/helpRequests/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Help Requests");
    const createButton = screen.queryByText("Create Help Request");
    expect(createButton).not.toBeInTheDocument();

    const testId = "HelpRequestsTable";
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
      ).toHaveTextContent("alice@ucsb.edu");
    });
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent("bob@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-requesterEmail`),
    ).toHaveTextContent("charlie@ucsb.edu");
  });

  test("Shows Create Help Request button for admin user", async () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/helpRequests/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Help Requests");
    const button = screen.getByText(/Create Help Request/);
    expect(button).toHaveAttribute("href", "/help-requests/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });
});
