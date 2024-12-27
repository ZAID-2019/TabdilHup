import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { ResponseUtil } from 'src/common/response.util';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly _prismaService: PrismaService) {} // Inject PrismaService
  private readonly logger = new Logger(UsersService.name); // Initializes logger with the class name

  // Get all users with pagination
  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 10; // Default limit to 10 if not provided
      offset = Number(offset) || 0; // Default offset to 0 if not provided
      const [users, total] = await Promise.all([
        this._prismaService.user.findMany({
          where: { deleted_at: null },
          take: limit,
          skip: offset,
          select: {
            id: true,
            last_name: true,
            first_name: true,
            username: true,
            phone_number: true,
            email: true,
            city: { select: { id: true, name_en: true, name_ar: true } },
            country: { select: { id: true, name_en: true, name_ar: true } },
            gender: true,
            birth_date: true,
            profile_picture: true,
            role: true,
            status: true,
            address: true,
            user_subscriptions: true,
          },
          orderBy: {
            created_at: 'desc', // Change 'created_at' to your desired field
          },
        }),
        this._prismaService.user.count({
          where: { deleted_at: null },
        }),
      ]);

      this.logger.verbose(`Successfully retrieved ${users.length} users`);
      return { users, total, status: 'success', message: 'Find All Users' };
    } catch (error) {
      this.logger.error(`Error In Find All Users: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for users', 'SEARCH_FAILED', error?.message);
    }
  }

  // Find a user by ID
  async findOne(id: string): Promise<unknown> {
    try {
      const user = await this._prismaService.user.findUnique({
        where: { id: id, status: UserStatus.ACTIVE, deleted_at: null },
        select: {
          id: true,
          last_name: true,
          first_name: true,
          username: true,
          phone_number: true,
          email: true,
          city: { select: { id: true, name_en: true, name_ar: true } },
          country: { select: { id: true, name_en: true, name_ar: true } },
          gender: true,
          birth_date: true,
          profile_picture: true,
          role: true,
          status: true,
          address: true,
          user_subscriptions: true,
        },
      });
      this.logger.verbose(`Successfully Retrieved User with ID: ${id}`);
      return { user, status: 'success', message: 'Find One User' };
    } catch (error) {
      this.logger.error(`Error In Find One User: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for users', 'SEARCH_FAILED', error?.message);
    }
  }

  // Create a new user
  async create(data: CreateUserDto): Promise<unknown> {
    try {
      //? Hash the password (10 is the salt rounds)
      const hashedPassword = await hash(data.password, 10);

      //? Split and format the birth_date (assuming format is YYYY-MM-DD)
      let birthDate = null;
      if (data.birth_date) {
        const [year, month, day] = data.birth_date.toString().split('-');
        birthDate = new Date(`${year}-${month}-${day}`);
      }

      //? Create the user using Prisma
      const createUser = await this._prismaService.user.create({
        data: {
          ...data, // Spread the DTO properties
          password: hashedPassword, // Use the hashed password
          birth_date: birthDate,
        },
      }); // Create a new user with provided data
      this.logger.verbose('User created successfully');
      return { createUser, status: 'success', message: 'User created successfully' };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error code
        const targetField = (error.meta as any)?.target; // Prisma provides this in the error meta
        if (targetField.includes('username')) {
          return {
            statusCode: 400,
            status: 'error',
            message: 'Username already exists.',
            error: {
              code: 'CREATE_FAILED',
              details: 'The username provided is already in use.',
            },
          };
        }
        if (targetField.includes('email')) {
          return {
            statusCode: 400,
            status: 'error',
            message: 'Email already exists.',
            error: {
              code: 'CREATE_FAILED',
              details: 'The email provided is already in use.',
            },
          };
        }
      }
      return ResponseUtil.error(error.message, 'CREATE_FAILED', error?.message);
    }
  }

  // Update an existing user by ID
  async update3(id: string, data: UpdateUserDto): Promise<unknown> {
    const user = await this._prismaService.user.findUnique({ where: { id: id } }); // Check if the user exists
    if (!user) throw new NotFoundException(`User not found`); // Throw error if user doesn't exist

    return this._prismaService.user.update({
      where: { id: id }, // Specify the user to update
      data, // Provide the updated data
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<unknown> {
    try {
      const user = await this._prismaService.user.findUnique({ where: { id: id } }); // Check if the user exists
      if (!user) throw new NotFoundException(`User not found`); // Throw error if user doesn't exist

      const updateData: any = { ...data }; // Start with the provided data

      //? Hash the password if it's provided
      if (data.password) {
        updateData.password = await hash(data.password, 10); // Hash the new password
      }

      //? Format the birth_date if it's provided
      if (data.birth_date) {
        const [year, month, day] = data.birth_date.toString().split('-');
        updateData.birth_date = new Date(`${year}-${month}-${day}`);
      }

      //? Update the user using Prisma
      const updatedUser = await this._prismaService.user.update({
        where: { id }, // Update user by ID
        data: updateData,
      });

      this.logger.verbose('User updated successfully');
      return { updatedUser, status: 'success', message: 'User updated successfully' };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error code
        const targetField = (error.meta as any)?.target; // Prisma provides this in the error meta
        if (targetField.includes('username')) {
          return {
            statusCode: 400,
            status: 'error',
            message: 'Username already exists.',
            error: {
              code: 'CREATE_FAILED',
              details: 'The username provided is already in use.',
            },
          };
        }
        if (targetField.includes('email')) {
          return {
            statusCode: 400,
            status: 'error',
            message: 'Email already exists.',
            error: {
              code: 'CREATE_FAILED',
              details: 'The email provided is already in use.',
            },
          };
        }
      }
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while updating the user', 'UPDATE_FAILED', error?.message);
    }
  }

  // Soft delete a user by ID
  async remove(id: string): Promise<unknown> {
    try {
      // Check if the user exists
      const user = await this._prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        return ResponseUtil.error('User not found', 'NOT_FOUND', 'User not found', 404);
      }

      // Perform soft delete by updating the `deleted_at` field
      await this._prismaService.user.update({
        where: { id },
        data: { deleted_at: new Date().toISOString() }, // Ensure UTC consistency
      });

      // Optionally log the soft delete operation for tracking
      this.logger.verbose(`User with ID ${id} soft deleted at ${new Date().toISOString()}`);
      return ResponseUtil.success('User deleted successfully', null, 204);
    } catch (error) {
      // Log the error for debugging
      this.logger.error(`Failed to soft delete user with ID ${id}:`, error);
      // Re-throw the error to ensure proper error handling by the caller
      return ResponseUtil.error('An error occurred while deleting the user', 'DELETE_FAILED', error?.message);
    }
  }

  // Search for users
  async search(query: string): Promise<unknown> {
    // console.log({ query });
    const limit = 10; // Default limit to 10 if not provided
    const offset = 1;
    const users = await this._prismaService.user.findMany({
      take: limit,
      skip: offset,
      where: {
        OR: [
          { first_name: { contains: query } }, // Search by first name
          { last_name: { contains: query } }, // Search by last name
          { email: { contains: query } }, // Search by email
          { username: { contains: query } }, // Search by email
        ],
      },
    });
    return users as []; // Type assertion to ensure correct type
  }

  async createMultiple(data: CreateUserDto): Promise<unknown> {
    const hashedPassword = await hash(data.password, 10); // Hash the password

    const batchSize = 1000; // Define the batch size
    const users = [];

    // Create all 500,000 user records in memory
    for (let index = 0; index <= 500000; index++) {
      users.push({
        ...data,
        password: hashedPassword, // Hashed password
        username: `${data.username}_${index}`, // Unique username
        email: `${data.username}_$${index}@gmail.com`, // Unique email
      });
    }

    // Insert users in batches
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize); // Get a batch of users

      await this._prismaService.user.createMany({
        data: batch,
        skipDuplicates: true, // Optional: Skip records with duplicate unique fields
      });

      // console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    return { message: 'Batch insertion completed' };
  }
}
