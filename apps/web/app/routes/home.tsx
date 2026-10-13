import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// API_URL wins when set (Docker, local overrides). On Render the Blueprint
// provides API_HOSTPORT, the address of the api service on the private network.
function getApiUrl() {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.API_HOSTPORT) return `http://${process.env.API_HOSTPORT}`;
  return "http://localhost:3000";
}

export async function loader() {
  try {
    const response = await fetch(getApiUrl());

    return { message: await response.text() };
  } catch {
    return { message: "(API unreachable)" };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
