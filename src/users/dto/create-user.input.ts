import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  full_name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  phone?: string;
}
