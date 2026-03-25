import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class BooksFilterInput {
  @Field(() => String, { nullable: true })
  isbn?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  author?: string;

  @Field(() => Int, { nullable: true })
  publication_year?: number;

  @Field(() => Boolean, { nullable: true })
  onlyWithTitle?: boolean;
}
