"use client";
import React from "react";
import { Button, Paper, TextInput } from "@mantine/core";
import { Title } from "@/components/Title";
import { useForm } from "@mantine/form";
import { bot_joinCallOnDemand } from "@/app/(protected)/dashboard/_actions/joinCall";

function JoinCall() {
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
    <Paper className="mt-4" p="sm" withBorder>
      <Title className="text-base">Join Zoom Meeting!</Title>
      <form
        className={"mt-4 flex gap-4 items-end"}
        action={() => {
          console.log("Join Call: ", form.values.link);
          bot_joinCallOnDemand(form.values.link);
        }}
      >
        <TextInput
          className={"grow"}
          labelProps={{ className: "text-sm" }}
          label={"Zoom Link"}
          name={"link"}
          value={form.values.link}
          onChange={(event) =>
            form.setFieldValue("link", event.currentTarget.value)
          }
          size="lg"
          placeholder={"https://us05web.zoom.us/s/859245?pwd=TEGTKYVsWs7bq5.1"}
        />
        <Button type={"submit"} size={"lg"}>
          Join
        </Button>
      </form>
    </Paper>
  );
}

export default JoinCall;
