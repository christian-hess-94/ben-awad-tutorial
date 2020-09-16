import { MyContext } from "./../types";
import { Post } from "./../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  //Cria o resolver para a Query posts e indica o tipo de resposta (Array de Post)
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return await em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("newTitle") newTitle: string,
    @Ctx() context: MyContext
  ): Promise<Post | null> {
    const { em } = context;
    const post = await this.post(id, context);
    if (!post) {
      return null;
    }
    if (typeof newTitle !== "undefined") {
      post.title = newTitle;
      await em.persistAndFlush(post);
    }
    return post;
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() context: MyContext
  ): Promise<Boolean> {
    const { em } = context;
    const post = await this.post(id, context);
    if (!post) {
      return false;
    } else {
      await em.removeAndFlush(post);
      return true;
    }
  }
}
