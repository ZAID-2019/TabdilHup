import { Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/response.util';

@Injectable()
export class AuthService {
  constructor(private _prismaService: PrismaService) {}
  private readonly logger = new Logger(AuthService.name); // Initializes logger with the class name

  // Create a new user
  async register(data: RegisterDto): Promise<unknown> {
    try {
      const existingUser = await this._prismaService.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          return ResponseUtil.error('User already registered', 'USER_EXISTS', 'Email already exists');
        }

        if (existingUser.username === data.username) {
          return ResponseUtil.error('Username already registered', 'USER_EXISTS', 'Username already exists');
        }
      }

      //? Hash the password (10 is the salt rounds)
      const hashedPassword = await hash(data.password, 10);

      //? Split and format the birth_date (assuming format is YYYY-MM-DD)

      const [year, month, day] = data.birth_date.toString().split('-');
      const birthDate = new Date(`${year}-${month}-${day}`);

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
}
