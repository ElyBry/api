import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCabinetInput {
  @Field(() => String, { nullable: true })
  number?: string;
}
