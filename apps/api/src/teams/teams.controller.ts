import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../access/access.decorators';
import type { SafeUserProfile } from '../auth/auth.types';
import { CreateTeamDto } from './create-team.dto';
import { ListTeamsQueryDto } from './list-teams-query.dto';
import { PaginatedTeamsResponseDto, TeamDto } from './team.dto';
import { TeamsService } from './teams.service';
import { UpdateTeamDto } from './update-team.dto';

@ApiTags('teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiResponse({ status: 201, type: TeamDto })
  create(@CurrentUser() user: SafeUserProfile, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(user.id, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: PaginatedTeamsResponseDto })
  findAll(@CurrentUser() user: SafeUserProfile, @Query() query: ListTeamsQueryDto) {
    return this.teamsService.findAll(user, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TeamDto })
  findById(@CurrentUser() user: SafeUserProfile, @Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findById(user, id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: TeamDto })
  update(
    @CurrentUser() user: SafeUserProfile,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: SafeUserProfile, @Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.remove(user, id);
  }
}
