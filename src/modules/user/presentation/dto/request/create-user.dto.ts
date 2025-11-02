import { ArrayMinSize, IsArray, IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { CreateUserInput } from "src/modules/user/application/inputs/create-user.input";

export class CreateUserDto implements CreateUserInput {

  @MaxLength(60)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(60)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
 
  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @IsString()
  @IsNotEmpty()
  whatsAppNumber: string;

  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  rolesIds: number[];
}