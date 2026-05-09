import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.matchmakingService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.matchmakingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchmakingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.matchmakingService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchmakingService.remove(+id);
  }
}
