import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((props) => {
      mockNavigate(props);
      return null;
    }),
  };
});

describe("RecommendationRequestCreatePage tests", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    setupUserOnly();
  });

  test("renders the form inputs", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByLabelText("Requester Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Professor Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Explanation")).toBeInTheDocument();
    expect(screen.getByLabelText("Date Requested (iso)")).toBeInTheDocument();
    expect(screen.getByLabelText("Date Needed (iso)")).toBeInTheDocument();
  });

  test("on submit, posts to backend and navigates to /recommendationrequest", async () => {
    const recommendationRequest = {
      id: 7,
      requesterEmail: "alice@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Grad apps",
      dateRequested: "2025-01-01T09:00",
      dateNeeded: "2025-02-01T17:00",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const requesterEmailInput = await screen.findByLabelText("Requester Email");
    const professorEmailInput = screen.getByLabelText("Professor Email");
    const explanationInput = screen.getByLabelText("Explanation");
    const dateRequestedInput = screen.getByLabelText("Date Requested (iso)");
    const dateNeededInput = screen.getByLabelText("Date Needed (iso)");
    const doneSwitch = screen.getByLabelText("Done");
    const submitButton = screen.getByText("Create");

    fireEvent.change(requesterEmailInput, {
      target: { value: "alice@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationInput, { target: { value: "Grad apps" } });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2025-01-01T09:00" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2025-02-01T17:00" },
    });
    fireEvent.click(doneSwitch);
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "alice@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Grad apps",
      dateRequested: "2025-01-01T09:00",
      dateNeeded: "2025-02-01T17:00",
      done: true,
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New RecommendationRequest Created - id: 7 requesterEmail: alice@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/recommendationrequest",
    });
  });
});
