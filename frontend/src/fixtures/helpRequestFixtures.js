const helpRequestFixtures = {
  oneHelpRequest: {
    requesterEmail: "omaraboutaleb@ucsb.edu",
    teamId: "f25-16",
    tableOrBreakoutRoom: "Table 16",
    requestTime: "2025-11-04T11:30:00",
    explanation: "Need help debugging POST endpoint for HelpRequestController",
    solved: true,
  },
  threeHelpRequests: [
    {
      requesterEmail: "alice@ucsb.edu",
      teamId: "f25-1",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2025-11-04T10:00:00",
      explanation: "Dokku deployment not working",
      solved: false,
    },
    {
      requesterEmail: "bob@ucsb.edu",
      teamId: "f25-2",
      tableOrBreakoutRoom: "Breakout Room 2",
      requestTime: "2025-11-04T10:45:00",
      explanation: "Issue with React state management",
      solved: true,
    },
    {
      requesterEmail: "charlie@ucsb.edu",
      teamId: "f25-3",
      tableOrBreakoutRoom: "Table 7",
      requestTime: "2025-11-04T11:15:00",
      explanation: "Github Actions CI/CD pipeline failing",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
