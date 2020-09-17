import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
// import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  console.clear();
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up(); //executa migrations pendentes

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }), //Passa o contexto do MikroORM para dentro do contexto do Apollo GraphQL (para usar nos reducers)
  });

  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000/graphql")
  );
};

main().catch((err) => console.log(err));
