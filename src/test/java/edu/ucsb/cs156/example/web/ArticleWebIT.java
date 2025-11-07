package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;
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
public class ArticleWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_and_delete_article() throws Exception {
    setupUser(true);

    page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Articles")).click();

    page.getByText("Create Article").click();
    assertThat(page.getByText("Create New Article")).isVisible();
    page.getByTestId("ArticlesForm-title").fill("Article Title for Testing");
    page.getByTestId("ArticlesForm-url").fill("https://example.com/article");
    page.getByTestId("ArticlesForm-explanation").fill("Explanation of the article");
    page.getByTestId("ArticlesForm-submitterEmail").fill("m_srivastava@ucsb.edu");
    page.getByTestId("ArticlesForm-dateAdded").fill("2025-11-06T12:00");
    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title"))
        .hasText("Article Title for Testing");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-url"))
        .hasText("https://example.com/article");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
        .hasText("Explanation of the article");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-submitterEmail"))
        .hasText("m_srivastava@ucsb.edu");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-dateAdded"))
        .hasText("2025-11-06T12:00:00");

    page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_article() throws Exception {
    setupUser(false);

    page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Articles")).click();

    assertThat(page.getByText("Create Article")).not().isVisible();
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
  }
}
