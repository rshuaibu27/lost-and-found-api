import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UsersService } from '../users.service';
import { UpdateUserDTO } from '../dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new app user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async createUser(@Body() dto: CreateUserDTO,  @Req() req: Request) {
        return this.usersService.createUser(dto);
    }

    @Post('admin')
    @ApiOperation({ summary: 'Create a new admin account' })
    @ApiResponse({ status: 201, description: 'Admin created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async createAdmin(@Body() dto: CreateUserDTO,  @Req() req: Request) {
        return this.usersService.createAdminUser(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    async getAllUser() {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a user' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
        return this.usersService.updateUser(id, dto);
    }
}
