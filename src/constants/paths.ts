const Paths = {
  dashboard: {
    home: () => "/",
    integrations: () => "/integrations",
    meetings: () => "/meetings",
    meetingDetails: (id: string, botId: string) => `/meetings/${id}?b=${botId}`,
  },
};

export default Paths;
