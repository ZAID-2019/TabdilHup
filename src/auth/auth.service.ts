import { Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/common/response.util';
import { JwtService } from '@nestjs/jwt';
import { stat } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private _prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name); // Initializes logger with the class name

  // Create a new user
  async register(data: RegisterDto): Promise<unknown> {
    try {
      //? Hash the password (10 is the salt rounds)
      const hashedPassword = await bcrypt.hash(data.password, 10);

      //? Split and format the birth_date (assuming format is YYYY-MM-DD)

      const [year, month, day] = data.birth_date.toString().split('-');
      const birthDate = new Date(`${year}-${month}-${day}`);

      //? Create the user using Prisma
      await this._prismaService.user.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          email: data.email,
          gender: data.gender,
          role: data.role,
          status: data.status,
          phone_number: data.phone_number,
          profile_picture: data.profile_picture,
          personal_identity_picture: data.personal_identity_picture,
          address: data.address,
          city_id: data.city_id,
          country_id: data.country_id,
          birth_date: birthDate,
          password: hashedPassword, // Use the hashed password
        },
      }); // Create a new user with provided data
      this.logger.verbose('User created successfully');
      return ResponseUtil.success('User created successfully');
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


  // Login method to generate JWT
  async login(emailOrUsername: string, password: string): Promise<any> {
    // Validate user credentials
    // Check if the user exists by email or username
    const user = await this._prismaService.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log({ isPasswordValid });

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    // Create the JWT payload
    const payload = { userId: user.id, email: user.email, role: user.role };

    // Generate the JWT token
    const token = this.jwtService.sign(payload);

    return { statusCode: 200, message: 'Login successful', token: token };
  }
}
