const Paths = {
  dashboard: {
    // home: () => "/",
    // TODO: fix this when we add a home page
    home: () => "/meetings",
    integrations: () => "/integrations",
    meetings: () => "/meetings",
    meetingDetails: (id: string, botId: string) => `/meetings/${id}?b=${botId}`,
  },
};

export default Paths;
