import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";


export class SendRequestDto{
    @IsString()
    @IsNotEmpty()
    sender : string

    @IsString()
    @IsNotEmpty()
    receiver: string
}