import { render, screen } from "@testing-library/react";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

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

  test("renders empty table correctly", () => {
    render(
      <ArticlesTable
        articles={[]}
        currentUser={currentUserFixtures.userOnly}
      />,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.queryByTestId(`${testId}-cell-row-0-col-${field}`),
      ).not.toBeInTheDocument();
    });
  });

  test("renders data correctly", () => {
    render(
      <ArticlesTable
        articles={articlesFixtures.threeArticles}
        currentUser={currentUserFixtures.adminUser}
      />,
    );

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
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("Chromatic Introduction");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-url`),
    ).toHaveTextContent("https://ucsb-cs156.github.io/topics/chromatic/");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`),
    ).toHaveTextContent("2022-01-03T00:00:00");
  });
});
