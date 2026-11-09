import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Welcome } from "./welcome";

test("renders the greeting as the page heading", async () => {
  const screen = await render(<Welcome name="Pokapu" />);

  await expect
    .element(screen.getByRole("heading", { level: 1 }))
    .toHaveTextContent("Kia ora, Pokapu");
});
