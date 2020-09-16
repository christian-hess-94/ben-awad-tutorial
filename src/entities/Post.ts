import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

//permite usar a mesma classe como ORM e como mapeamento do GraphQL
@ObjectType() //faz ser um type do graphql
@Entity() //Faz ser uma entidade do banco de dados
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date", default: "NOW()" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date(), default: "NOW()" })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
