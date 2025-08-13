import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { AlreadyExistsException } from 'src/common/exceptions/AlreadyExists.exception';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(dto: CreateUserDTO){
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new AlreadyExistsException('A user with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            },
        });
        return user;
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
