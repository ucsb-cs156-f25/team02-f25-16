package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired UCSBDiningCommonsMenuItemRepository menuitemRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  // @Transactional
  // public UCSBDiningCommonsMenuItem store_one_record_in_database() throws Exception {
  //   UCSBDiningCommonsMenuItem menuitem1 =
  //       UCSBDiningCommonsMenuItem.builder()
  //           //.id(1L)
  //           .diningCommonsCode("chicken")
  //           .name("Chicken")
  //           .station("Protein")
  //           .build();
  //   menuitemRepository.save(menuitem1);
  //   return menuitem1;
  // }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public UCSBDiningCommonsMenuItem createAndSaveMenuItem() {
    UCSBDiningCommonsMenuItem menuitem1 =
        UCSBDiningCommonsMenuItem.builder()
            .diningCommonsCode("chicken")
            .name("Chicken")
            .station("Protein")
            .build();

    // This transaction commits immediately upon return
    return menuitemRepository.save(menuitem1);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange

    UCSBDiningCommonsMenuItem menuitem1 = createAndSaveMenuItem();

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/ucsbdiningcommonsmenuitems?id=" + menuitem1.getId()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    UCSBDiningCommonsMenuItem menuitem2 =
        UCSBDiningCommonsMenuItem.builder()
            .id(menuitem1.getId())
            .diningCommonsCode("chicken")
            .name("Chicken")
            .station("Protein")
            .build();
    String expectedJson = mapper.writeValueAsString(menuitem2);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_restaurant() throws Exception {
    // arrange

    UCSBDiningCommonsMenuItem menuitem1 =
        UCSBDiningCommonsMenuItem.builder()
            .id(1L)
            .diningCommonsCode("chicken")
            .name("Chicken")
            .station("Protein")
            .build();
    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/ucsbdiningcommonsmenuitems/post?diningCommonsCode=chicken&name=Chicken&station=Protein")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(menuitem1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}
