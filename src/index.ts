// import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  console.log("Hello tu");
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up(); //executa migrations pendentes
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });
  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000/graphql")
  );
};

main().catch((err) => console.log(err));
