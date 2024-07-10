import { Button, Paper, Text, Title } from "@mantine/core";
import { IconBrandSlack } from "@tabler/icons-react";

function generateAuthUrl(redirectUri: string, zoomAppClientId: string): string {
  const baseUrl = "https://zoom.us/oauth/authorize";
  const queryParams = {
    response_type: "code",
    redirect_uri: redirectUri,
    client_id: zoomAppClientId,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  return `${baseUrl}?${queryString}`;
}

export default function IntegrationCard() {
  return (
    <Paper className="border-2 border-gray-100" mb={8} px={10} py={6}>
      <div className="flex justify-between items-center">
        <div className="grow flex">
          <IconBrandSlack width={36} height={36} />
          <Title order={3} px={8}>
            Slack
          </Title>
        </div>
        <Button variant="subtle" size="compact-md">
          Install
        </Button>
      </div>
      <Text size="sm" color="gray.6">
        Connect your Slack workspace to receive notifications about your Zoom
        meetings. Shoja shares meeting details, reminders, and call summaries
        etc.
      </Text>
    </Paper>
  );
}
