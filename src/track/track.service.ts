import { Injectable } from '@nestjs/common';
import { Track } from './schemas/track.schema';
import { Comment } from './schemas/comment.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, image, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const imagePath = this.fileService.createFile(FileType.IMAGE, image);

    return await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      image: imagePath,
    });
  }

  async getAll(limit = 10, offset = 0): Promise<Track[]> {
    return this.trackModel.find().skip(Number(offset)).limit(Number(limit));
  }

  async search(queryParams: { [key: string]: string }): Promise<Track[]> {
    const filter = {};
    for (const key in queryParams) {
      if (queryParams[key]) {
        filter[key] = { $regex: new RegExp(queryParams[key], 'i') };
      }
    }
    return this.trackModel.find(filter);
  }

  async getOne(id: ObjectId): Promise<Track> {
    return this.trackModel.findById(id).populate('comments');
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    return this.trackModel.findByIdAndDelete(id);
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }
}
