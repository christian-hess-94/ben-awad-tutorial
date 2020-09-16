// import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";

const main = async () => {
  console.log("Hello tu");
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up(); //executa migrations pendentes

  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // console.log("-----------sql 2-----------");
  // await orm.em.nativeInsert(Post, { title: "my frst post" }); //necessita colocar todos os dados (não usa defaults das classes)
  // const posts = await orm.em.find(Post, {});
  // console.table(posts);
};

main().catch((err) => console.log(err));
