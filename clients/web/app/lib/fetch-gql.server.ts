import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print, getOperationAST } from "graphql";
import { log } from "~/utils";

type GqlFetchResult<TData = any> = {
  data?: TData;
  errors?: Error[];
};

/*
  The protocols can be:
    - application/graphql+json (or application/json for legacy clients) 
      for a single result that yields from the execution phase
    - multipart/mixed 
      for incremental delivery (when using @defer and @stream directives).
    - text/event-stream (not officially in the specification, but also used)
      for event streams (e.g. when executing subscription or live query operations).
  */
enum ContentType {
  GraphQLJson = "application/graphql+json",
  Json = "application/json",
  Multipart = "multipart/mixed",
  Event = "text/event-stream",
}

export async function fetchGql<TData = any, TVariables = Record<string, any>>(
  queryDocument: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  request: Request
): Promise<GqlFetchResult<TData> | void> {
  const headers = new Headers();
  headers.set("content-type", ContentType.Json);

  const operationName = getOperationAST(queryDocument)?.name?.value;

  const config: RequestInit = {
    headers,
    method: "POST",
    body: JSON.stringify({
      query: print(queryDocument),
      variables,
      ...(operationName && { operationName }),
    }),
  };

  try {
    if (!process.env?.API_URL)
      throw new Error("Missing API_URL environment value.");

    log({
      req: request,
      operationName,
      message: "Operation Attempt",
    });
    const response = await fetch(process.env.API_URL, config);

    if (!response.ok) {
      throw new Response(response.statusText, {
        status: response.status || 500,
      });
    }

    const result = await response.json();

    log({
      res: response,
      payload: result.data,
      operationName,
      message: `Operation ${result?.errors ? "Error" : "Success"}`,
      ...(result?.errors && { err: result.errors }),
    });

    return result;
  } catch (error) {
    log({
      err: error,
      message: "Operation Error",
      req: request,
      operationName,
    });

    if (error instanceof Error) {
      if ((error as Error & { code: string }).code === "ECONNREFUSED") {
        throw new Response("Service Unavailable", { status: 503 });
      } else {
        throw new Response(error.message, { status: 500 });
      }
    } else {
      throw new Response("Unknown Error", { status: 500 });
    }
  }
}
