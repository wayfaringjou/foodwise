import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "graphql/app.schema.graphql",
  documents: ["app/**/*.graphql"],
  generates: {
    "app/graphql/__generated__/operations.ts": {
      //preset: "client",
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      // presetConfig: {
      //   gqlTagName: "gql",
      // },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
