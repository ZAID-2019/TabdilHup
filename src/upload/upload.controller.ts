import { Controller, Logger, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('api/upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  private readonly logger = new Logger(UploadController.name);

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      this.logger.verbose(`Image uploaded successfully: ${result.url}`);
      return {
        message: 'Image uploaded successfully',
        result,
      };
    } catch (error) {
      this.logger.error(`Image upload failed: ${error.message}`);
      return {
        message: 'Image upload failed',
        error,
      };
    }
  }
}
