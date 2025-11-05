const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "alice@ucsb.edu",
    professorEmail: "prof@ucsb.edu",
    explanation: "Grad apps",
    dateRequested: "2025-01-01T09:00:00",
    dateNeeded: "2025-02-01T17:00:00",
    done: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "alice@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Grad apps",
      dateRequested: "2025-01-01T09:00:00",
      dateNeeded: "2025-02-01T17:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "bob@ucsb.edu",
      professorEmail: "advisor@ucsb.edu",
      explanation: "Internship",
      dateRequested: "2025-03-10T10:30:00",
      dateNeeded: "2025-03-25T23:59:59",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "saqif@ucsb.edu",
      professorEmail: "vigna@ucsb.edu",
      explanation: "PhD applications",
      dateRequested: "2025-10-28T13:45:00",
      dateNeeded: "2025-11-05T17:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
