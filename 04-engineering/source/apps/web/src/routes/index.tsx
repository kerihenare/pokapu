import { createFileRoute } from "@tanstack/react-router";

import { Welcome } from "../components/welcome";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Welcome name="Pokapu" />
    </main>
  );
}
