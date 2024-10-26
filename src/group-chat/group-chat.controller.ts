import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { AuthGuard } from 'src/guards/guards.guard';
import { SearchDto } from './dto/search.dto';
import { JoinGroupDto } from './dto/Join-group.dto';
import { GetGroupData } from './dto/get-group-data.dto';
import { CustomRequest } from 'src/types/express-request.interface';

@UseGuards(AuthGuard)
@Controller('group-chat')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) { }

  @Post('create')
  create(@Body() createGroupChatDto: CreateGroupChatDto, @Req() req: CustomRequest) {
    return this.groupChatService.create(createGroupChatDto, req.user.userId);
  }


  @Get('s')
  search(@Query() query: SearchDto) {
    return this.groupChatService.searchGroup(query.input)
  }

  @Get('join/:groupId')
  joinGroup(@Param() param: JoinGroupDto, @Req() req: CustomRequest) {
    return this.groupChatService.joinGroup(param.groupId, req.user.userId)
  }

  @Get('my-group')
  getMyGroups(@Req() req: CustomRequest) {
    return this.groupChatService.getMyGroups(req.user.userId)
  }

  @Get(':groupId')
  getGroupData(@Param() param: GetGroupData){
    return this.groupChatService.getGroupData(param.groupId)
  }
}
