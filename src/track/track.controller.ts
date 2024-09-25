import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const { image, audio } = files;
    if (!audio || audio.length === 0) {
      throw new BadRequestException('Audio file is required!');
    }

    if (audio[0].mimetype !== 'audio/mpeg') {
      throw new BadRequestException('Only mp3 files are allowed!');
    }
    const imageFile = image && image.length > 0 ? image[0] : undefined;
    const audioFile = audio[0];
    return this.trackService.create(dto, imageFile, audioFile);
  }

  @Get()
  getAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.trackService.getAll(limit, offset);
  }

  @Get('/search')
  search(@Query() queryParams: { [key: string]: string }) {
    return this.trackService.search(queryParams);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  addComment(@Request() req, @Body() dto: CreateCommentDto) {
    const user = req.user;
    return this.trackService.addComment(dto, user);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
