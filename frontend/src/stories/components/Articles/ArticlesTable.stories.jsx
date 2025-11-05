import React from "react";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "components/Articles/ArticlesTable",
  component: ArticlesTable,
};

const Template = (args) => {
  return <ArticlesTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  articles: [],
  currentUser: currentUserFixtures.userOnly,
};

export const WithArticles = Template.bind({});
WithArticles.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.adminUser,
};
