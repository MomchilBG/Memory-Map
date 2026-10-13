import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  try {
    const response = await fetch(process.env.API_URL ?? "http://localhost:3000");

    return { message: await response.text() };
  } catch {
    return { message: "(API unreachable)" };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
