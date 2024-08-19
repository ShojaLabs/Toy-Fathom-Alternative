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

export const AbsolutePaths = {
  dashboard: {
    meetingDetails: (id: string, botId: string) =>
      `${process.env.NEXT_PUBLIC_APP_DOMAIN}/meetings/${id}?b=${botId}`,
  },
};
