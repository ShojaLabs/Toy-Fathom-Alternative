import React from "react";
import { Paper } from '@mantine/core';
import { Search } from "./search";

export function AppHeader() {
  return (
    <Paper
      className="h-full p-2 flex justify-center"
      bg="gray.0"
      withBorder
    >
      <Search />
    </Paper>
  );
}