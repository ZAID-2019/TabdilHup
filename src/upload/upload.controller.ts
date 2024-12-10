import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('api/upload')
export class UploadController {

    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    
    async uploadImage(@UploadedFile() file: Express.Multer.File) {

        // console.log("File received: ", file); // Debugging log
        if (!file) {
            return { message: 'No file uploaded' };
        }
        
        try {
            // console.log("file 1", file);
            const result = await this.cloudinaryService.uploadImage(file);

            return {
                message: 'Image uploaded successfully',
                result,
            };
        } catch (error) {
            return {
                message: 'Image upload failed',
                error,
            };
        }
    }
}
