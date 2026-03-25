import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { IdResult } from '../common/id.model';
import { Cabinet } from './cabinet.model';
import { CreateCabinetInput } from './dto/create-cabinet.input';
import { UpdateCabinetInput } from './dto/update-cabinet.input';
import { CabinetsService } from './cabinets.service';

@Resolver(() => Cabinet)
export class CabinetsResolver {
  constructor(private readonly cabinetsService: CabinetsService) {}

  @Query(() => [Cabinet], { name: 'cabinets' })
  async cabinets(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.cabinetsService.findAll(l, offset);
  }

  @Query(() => Cabinet, { name: 'cabinet', nullable: true })
  async cabinet(@Args('id', { type: () => Int }) id: number) {
    return this.cabinetsService.findOne(id);
  }

  @Mutation(() => Cabinet)
  async createCabinet(@Args('input') input: CreateCabinetInput) {
    return this.cabinetsService.create({ number: input.number });
  }

  @Mutation(() => Cabinet, { nullable: true })
  async updateCabinet(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCabinetInput,
  ) {
    return this.cabinetsService.update(id, { number: input.number });
  }

  @Mutation(() => IdResult)
  async deleteCabinet(@Args('id', { type: () => Int }) id: number) {
    return this.cabinetsService.softDelete(id);
  }
}
