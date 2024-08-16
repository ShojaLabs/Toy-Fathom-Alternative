"use client";
import React from "react";
import { Button, Paper, TextInput } from "@mantine/core";
import { Title } from "@/ui-components/Title";
import { useForm } from "@mantine/form";
import { bot_joinCallOnDemand } from "./actions";

function JoinZoomCallOnDemand() {
  const form = useForm({
    initialValues: {
      link: "",
    },

    validate: {
      // e.g link = https://us05web.zoom.us/s/85999745245?pwd=TEGTKYVsWs7bq52CHuyorBQvcbsNHY.1
      link: (val) =>
        /^(https:\/\/(.+?)\.zoom.us\/.\/[0-9]+\?pwd=[A-Za-z0-9]+\.1)$/.test(val)
          ? null
          : "Invalid zoom link",
    },
  });
  return (
    <div className="w-[560px]">
      <Title className="text-sm font-normal mb-1">Join Zoom Meeting</Title>
      <form
        className={"flex gap-2 items-end"}
        action={() => {
          const zoomUrl = form.values.link;
          form.reset();
          console.log("Join Call: ", zoomUrl);
          bot_joinCallOnDemand(zoomUrl);

          window.open(zoomUrl, "_blank");
        }}
      >
        <TextInput
          variant="filled"
          className="grow"
          labelProps={{ className: "text-sm" }}
          name={"link"}
          value={form.values.link}
          onChange={(event) =>
            form.setFieldValue("link", event.currentTarget.value)
          }
          placeholder={"https://us05web.zoom.us/s/xxxxxx?pwd=xxxxxxxxx.1"}
        />
        <Button type="submit" disabled={!form.values.link}>
          Join With Bot
        </Button>
      </form>
    </div>
  );
}

export default JoinZoomCallOnDemand;
