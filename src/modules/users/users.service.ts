import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { AlreadyExistsException } from 'src/common/exceptions/AlreadyExists.exception';
import { UserType } from './types/user.type';
import { find } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    private async findRole(roleName: UserType) {
       const role = this.prisma.role.findUnique({ where: { roleName } });
       if (!role) throw new NotFoundException(`Role ${roleName} not found`);
       return role;
    }

    private async checkExistingUser(email: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) throw new AlreadyExistsException('A user with this email already exists');
    }

    async createUser(dto: CreateUserDTO){
        await this.checkExistingUser(dto.email);

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
        return user;
    }

    async createAdminUser(dto: CreateUserDTO) {
        await this.checkExistingUser(dto.email);
        
        const {email, firstName, lastName, phoneNumber} = dto;
        const adminRole = await this.findRole(UserType.ADMIN);

        if(!adminRole) throw new NotFoundException('Admin role not found');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email, firstName, lastName, phoneNumber, password: hashedPassword,
                roles: {connect: {id: adminRole.id}}
                
            },
        });
    }

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deleteUser(id: string) {
        try {
            await this.prisma.user.delete({ where: { id } });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw error;
        }
    }

    async updateUser(id: string, dto: UpdateUserDTO) {
        try {
            if (dto.password) {
                dto.password = await bcrypt.hash(dto.password, 10);
            }

            return await this.prisma.user.update({
                where: { id },
                data: dto,
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User not found');
            }
        throw error;
    }
  }
}
