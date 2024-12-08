import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { ResponseUtil } from 'src/common/response.util';

@Injectable()
export class UsersService {
  constructor(private readonly _prismaService: PrismaService) {} // Inject PrismaService
  private readonly logger = new Logger(UsersService.name); // Initializes logger with the class name

  // Get all users with pagination
  async findAll(limit?: number, offset?: number): Promise<unknown> {
    try {
      limit = Number(limit) || 2000; // Default limit to 10 if not provided
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
      return ResponseUtil.success('Find All Users', { users, total });
    } catch (error) {
      this.logger.error(`Error In Find All Users: ${error.message}`, error.stack);
      return ResponseUtil.error('An error occurred while searching for medicines', 'SEARCH_FAILED', error?.message);
    }
  }

  // Find a user by ID
  async findOne(id: string): Promise<unknown> {
    const user = await this._prismaService.user.findUnique({
      where: { id: id },
    });
    return user; // Type assertion to ensure correct type
  }

  // Create a new user
  async create(data: CreateUserDto): Promise<unknown> {
    try {
      //? Hash the password (10 is the salt rounds)
      const hashedPassword = await hash(data.password, 10);

      //? Split and format the birth_date (assuming format is YYYY-MM-DD)
      let birthDate;
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
      return ResponseUtil.success('User created successfully', createUser);
    } catch (error) {
      return ResponseUtil.error(error.message, 'CREATE_FAILED', error?.message);
    }
  }

  // Update an existing user by ID
  async update(id: string, data: UpdateUserDto): Promise<unknown> {
    const user = await this._prismaService.user.findUnique({ where: { id: id } }); // Check if the user exists
    if (!user) throw new NotFoundException(`User not found`); // Throw error if user doesn't exist

    return this._prismaService.user.update({
      where: { id: id }, // Specify the user to update
      data, // Provide the updated data
    });
  }

  // Soft delete a user by ID
  async remove(id: string): Promise<unknown> {
    const user = await this._prismaService.user.findUnique({ where: { id: id } }); // Check if the user exists
    if (!user) throw new NotFoundException(`User not found`); // Throw error if user doesn't exist

    // Soft delete by setting the deletedAt field to the current date
    return this._prismaService.user.update({
      where: { id: id }, // Specify the user to update
      data: { deleted_at: new Date() }, // Set the deletedAt field to mark as deleted
    });
  }

  // Search for users
  async search(query: string): Promise<unknown> {
    console.log({ query });
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

      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    return { message: 'Batch insertion completed' };
  }
}
