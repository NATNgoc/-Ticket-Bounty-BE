import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 100)
    name: string;

    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

}
