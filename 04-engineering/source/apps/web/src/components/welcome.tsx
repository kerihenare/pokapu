import { greeting } from "../lib/greeting";

export function Welcome({ name }: Readonly<{ name: string }>) {
  return <h1>{greeting(name)}</h1>;
}
