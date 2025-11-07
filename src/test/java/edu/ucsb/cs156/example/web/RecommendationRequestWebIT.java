package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {

  @Test
  public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
    setupUser(true);

    page.getByText("RecommendationRequest").click();

    page.getByText("Create RecommendationRequest").click();
    assertThat(page.getByText("Create Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-requesterEmail").fill("alice@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-professorEmail").fill("prof@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-explanation").fill("Letter for grad school");
    page.getByTestId("RecommendationRequestForm-dateRequested").fill("2025-01-01T09:00");
    page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2025-02-01T17:00");
    page.getByTestId("RecommendationRequestForm-done").check();
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("alice@ucsb.edu");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Letter for grad school");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-done")).hasText("true");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-explanation").fill("Updated explanation");
    page.getByTestId("RecommendationRequestForm-done").uncheck();
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Updated explanation");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-done")).hasText("false");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-id")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendation_request() throws Exception {
    setupUser(false);

    page.getByText("RecommendationRequest").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
  }
}
