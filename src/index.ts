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
//Redis

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  console.clear();
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up(); //executa migrations pendentes
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        // disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        secure: __prod__, //cookie only works in HTTPS
        sameSite: "lax", //CSRF
      },
      secret: "safsafasdasdsadasdasd",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }), //Passa o contexto do MikroORM para dentro do contexto do Apollo GraphQL (para usar nos reducers)
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000/graphql")
  );
};

main().catch((err) => console.log(err));
