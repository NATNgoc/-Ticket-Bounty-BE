import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class LoginUserDto {

    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

}
