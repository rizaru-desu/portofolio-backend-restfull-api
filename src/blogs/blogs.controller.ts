import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { lookup } from 'mime-types';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createId } from '@paralleldrive/cuid2';
import { ChangeStatusDto, detailDto, SaveBlogDto } from './blogs.dto';
import { BlogsService } from './blogs.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @AllowAnonymous()
  @Get('cover/:filename')
  serveCover(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.resolve(`./uploads/blogs/${filename}`);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    const mimeType = lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);

    const stream = createReadStream(filePath);
    stream.pipe(res);
  }

  @Post('save')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (_, file, cb) =>
          cb(null, createId() + path.extname(file.originalname)),
      }),
    }),
  )
  async saveBlog(
    @Body() dto: SaveBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const coverImagePath = file?.path;
    return this.blogService.saveBlog(dto, coverImagePath);
  }

  @AllowAnonymous()
  @Post('detail')
  async detailBlog(@Body() body: detailDto) {
    return this.blogService.detailBlog(body);
  }

  @Put('status')
  async changeStatus(@Body() dto: ChangeStatusDto) {
    return this.blogService.changeStatus(dto);
  }
}
