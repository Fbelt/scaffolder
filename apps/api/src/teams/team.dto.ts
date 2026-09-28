import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../common/dto/pagination.dto';

export class TeamDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true, type: String }) description!: string | null;
  @ApiProperty() ownerId!: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}

export class PaginatedTeamsResponseDto {
  @ApiProperty({ type: [TeamDto] }) data!: TeamDto[];
  @ApiProperty({ type: PaginationMetaDto }) meta!: PaginationMetaDto;
}
