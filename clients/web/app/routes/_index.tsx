import { type V2_MetaFunction, type LoaderArgs, json } from "@remix-run/node";
import { GetHelloDocument } from "~/graphql/__generated__/operations";
import { fetchGql } from "~/lib";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const query = await fetchGql(GetHelloDocument, {}, request);

  if (query?.errors) {
    throw new Response(
      query?.errors?.map((e) => e.message).join("\n") ?? "Unknown Error",
      { status: 500 }
    );
  }

  return json(query?.data ?? null);
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Foodwise" },
    { name: "description", content: "Food journal" },
  ];
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.log(error);
    return (
      <div>
        <h1>Loader error:</h1>
        <p>{error.status}</p>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Unexpected Error!</h1>
      {error instanceof Error && <p>{error.message}</p>}
    </div>
  );
}

export default function Index() {
  const result = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Welcome to Foodwise</h1>
      <pre>{result?.hello}</pre>
    </main>
  );
}
