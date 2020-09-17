import { User } from "./entities/User";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

console.log("__dirname: ", __dirname);

export default {
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files (TS or JS)
  },
  // host: '',
  // port: ''
  dbName: "lireddit",
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]; //permite o auto complete do objeto de acordo com o parametros recebidos pela função "init"
