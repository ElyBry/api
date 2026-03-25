import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCabinetInput {
  @Field(() => String)
  number: string;
}
