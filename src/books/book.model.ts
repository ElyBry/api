import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String, { nullable: true })
  author: string | null;

  @Field(() => String)
  isbn: string;

  @Field(() => Int, { nullable: true })
  publication_year: number | null;

  @Field(() => Boolean)
  is_deleted: boolean;
}
