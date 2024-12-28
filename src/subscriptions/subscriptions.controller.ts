import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDTO } from './create-subscription.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly _subscriptionsService: SubscriptionsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: 200, description: 'List of Subscriptions.' })
  async findAll(@Query('limit') limit: number = 5000, @Query('offset') offset: number = 0) {
    return this._subscriptionsService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription found.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._subscriptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created.' })
  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDTO) {
    return this._subscriptionsService.create(createSubscriptionDto);
  }

  @ApiOperation({ summary: 'Update a subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription updated.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: CreateSubscriptionDTO) {
    return this._subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription by ID' })
  @ApiResponse({ status: 204, description: 'Subscription deleted.' })
  async remove(@Param('id') id: string) {
    return this._subscriptionsService.remove(id);
  }
}
