import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Cabinet {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  number: string;

  @Field(() => Boolean)
  is_deleted: boolean;
}
