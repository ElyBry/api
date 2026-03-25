import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  full_name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => Boolean)
  is_deleted: boolean;
}
