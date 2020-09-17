import { User } from "./../entities/User";
import { MyContext } from "src/types";
import {
  Field,
  InputType,
  Query,
  Resolver,
  Arg,
  Ctx,
  Mutation,
  ObjectType,
} from "type-graphql";
const argon2 = require("argon2");

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse | null> {
    console.clear();
    console.log(options);
    if (options.username.length < 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be at least 2",
          },
        ],
      };
    }
    if (options.password.length < 6) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be at least 6",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      switch (error.code) {
        //already exists
        case "23505":
          return {
            errors: [
              { field: "username", message: "This user already exists" },
            ],
          };
      }
    }
    return {
      user,
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse | null> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (valid) {
      req.session.userId = user.id; //salvando dado da sessão
      return {
        user,
      };
    } else {
      return {
        errors: [{ field: "password", message: "Wrong password" }],
      };
    }
  }
}
