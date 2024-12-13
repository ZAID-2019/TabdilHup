import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('api/users') // Group the endpoints under 'users'
@Controller('api/users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {} // Inject UsersService

  // Get a list of users with pagination
  @Get()
  async findAll(@Query('limit') limit: number = 5000, @Query('offset') offset: number = 0) {
    return this._usersService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  // Get a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._usersService.findOne(id); // Find user by ID
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created.' })
  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this._usersService.create(createUserDto); // Create user with data from the request
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated.' })
  // Update a user by ID
  @Put(':id')
  async update(
    @Param('id') id: string, // Get user ID from the URL
    @Body() updateUserDto: UpdateUserDto, // Get updated data from the request
  ) {
    return this._usersService.update(id, updateUserDto); // Update user
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted.' })
  // Delete a user by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this._usersService.remove(id); // Delete user
  }

  @Post('search')
  @ApiOperation({ summary: 'Search for users by query' })
  @ApiResponse({ status: 200, description: 'List of matching users.' })
  // Search for users by a query string
  @Post('search')
  async search(@Body('query') query: string) {
    return this._usersService.search(query); // Search users
  }

  @Post('/multiple')
  async createMultiple(@Body() createUserDto: CreateUserDto) {
    return this._usersService.createMultiple(createUserDto); // Create user with data from the request
  }
}
