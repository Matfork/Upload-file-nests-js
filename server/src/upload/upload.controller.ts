import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { CreateCatDto } from './dto/upload.dto';

@Controller('cats')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async newUpload(@UploadedFiles() files, @Body() uploadData: CreateCatDto) {
    console.log(files);
  }

  @Post('updateUpload')
  async updateUpload() {}
}
