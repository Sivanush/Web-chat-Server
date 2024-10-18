import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';

import { SearchUsersDto } from './dto/seachUsers.Dts';
import { SendRequestDto } from './dto/sendRequest.Dto';
import { UserService } from './user.service';
import { acceptOrRejectDto } from './dto/acceptOrRejectDto';
import { AuthGuard } from 'src/guards/guards.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('auth')
    async userAuthentication(@Body() userData:CreateUserDto){
        return this.userService.userAuthentication(userData)
    }

    @UseGuards(AuthGuard)
    @Get('s/:input')
    async searchUsers(@Param() params:SearchUsersDto, @Req() req:Request){
        return this.userService.searchUser(params.input,req.user.userId)
    }


    @UseGuards(AuthGuard)
    @Get('send/:receiver')
    async sendUserRequest(@Param() params:SendRequestDto, @Req() req:Request){
        return this.userService.sendUserRequest(req.user.userId, params.receiver)
    }

    @UseGuards(AuthGuard)
    @Get('get-requests')
    async getRequests(@Req() req:Request){
        return this.userService.getRequests(req.user.userId)
    }

    @UseGuards(AuthGuard)
    @Get('get-send-requests')
    async getSendRequests(@Req() req:Request){
        return this.userService.getSendRequests(req.user.userId)
    }


    @UseGuards(AuthGuard)
    @Post('request')
    async acceptOrRejectRequest(@Body() data:acceptOrRejectDto){
        return this.userService.acceptAndRejectUserRequest(data.requestId, data.status)
    }


    @UseGuards(AuthGuard)
    @Get('connections')
    async getAllConnections(@Req() req:Request){
        return this.userService.getAllConnections(req.user.userId)
    }


}