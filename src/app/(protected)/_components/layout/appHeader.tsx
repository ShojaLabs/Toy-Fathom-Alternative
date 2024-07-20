import React from "react";
import { Paper } from "@mantine/core";
import { Search } from "./search";
import { PageTitle } from "./pageTitle";

export function AppHeader() {
  return (
    <Paper className="h-full p-2 flex justify-between" bg="dark.6">
      <div className="flex-1 pl-2">
        <PageTitle />
      </div>
      <div className="flex-1">
        <Search />
      </div>
      <div className="flex-1" />
    </Paper>
  );
}
