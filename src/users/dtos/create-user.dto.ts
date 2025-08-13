import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;
  
  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;
}