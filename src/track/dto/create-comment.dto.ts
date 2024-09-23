import { ObjectId } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required!' })
  readonly username: string;

  @IsString({ message: 'Text must be a string' })
  @IsNotEmpty({ message: 'Text is required!' })
  readonly text: string;

  @IsString({ message: 'ObjectId must be a string' })
  @IsNotEmpty({ message: 'ObjectId is required!' })
  readonly trackId: ObjectId;
}
