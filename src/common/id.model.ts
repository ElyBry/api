import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IdResult {
  @Field(() => Int)
  id: number;
}
