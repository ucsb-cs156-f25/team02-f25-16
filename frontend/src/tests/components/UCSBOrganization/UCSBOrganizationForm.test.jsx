import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
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

describe("UCSBOrganizationForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByText(/Organization Code/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Organization Code/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBOrganization", async () => {
    render(
      <Router>
        <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
      </Router>,
    );
    await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
    expect(screen.getByText(/Organization Code/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue("GSAC");
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-submit");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Organization Code is required./);
    expect(screen.getByText(/Organization Translation Short is required./)).toBeInTheDocument();
    expect(screen.getByText(/Organization Translation is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBOrganizationForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-orgCode");

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
    const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
    const inactiveCheckbox = screen.getByTestId("UCSBOrganizationForm-inactive");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgCodeField, { target: { value: "GSAC" } });
    fireEvent.change(orgTranslationShortField, { target: { value: "Gaucho Sports Analytics" } });
    fireEvent.change(orgTranslationField, {
      target: { value: "Gaucho Sports Analytics Club" },
    });
    fireEvent.click(inactiveCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Organization Code is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Organization Translation Short is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Organization Translation is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-cancel");
    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
