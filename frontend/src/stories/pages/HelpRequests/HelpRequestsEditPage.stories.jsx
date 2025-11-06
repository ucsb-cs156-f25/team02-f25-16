import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

export default {
  title: "pages/HelpRequests/HelpRequestsEditPage",
  component: HelpRequestsEditPage,
};

const Template = () => <HelpRequestsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/helprequests", () =>
      HttpResponse.json({ id: 2, ...helpRequestFixtures.oneHelpRequest }, {
        status: 200,
      }),
    ),
    http.put("/api/helprequests", () =>
      HttpResponse.json({}, { status: 200 }),
    ),
  ],
};
