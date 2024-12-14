import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {} // Inject UsersService

  // Get a list of users with pagination
  @Get()
  async findAll(@Query('limit') limit: number = 5000, @Query('offset') offset: number = 0) {
    return this._usersService.findAll(limit, offset);
  }

  // Get a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._usersService.findOne(id); // Find user by ID
  }

  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this._usersService.create(createUserDto); // Create user with data from the request
  }

  // Update a user by ID
  @Put(':id')
  async update(
    @Param('id') id: string, // Get user ID from the URL
    @Body() updateUserDto: UpdateUserDto, // Get updated data from the request
  ) {
    return this._usersService.update(id, updateUserDto); // Update user
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this._usersService.remove(id); // Delete user
  }

  // Search for users by a query string
  @Post('search')
  async search(@Body('query') query: string) {
    return this._usersService.search(query); // Search users
  }

  // Create multiple users
  @Post('/multiple')
  async createMultiple(@Body() createUserDto: CreateUserDto) {
    return this._usersService.createMultiple(createUserDto); // Create user with data from the request
  }
}
