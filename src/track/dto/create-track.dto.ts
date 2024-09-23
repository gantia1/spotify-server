import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Buffer } from 'buffer';

export interface Upload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class CreateTrackDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required!' })
  readonly name: string;

  @IsString({ message: 'Artist must be a string' })
  @IsNotEmpty({ message: 'Artist is required!' })
  readonly artist: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required!' })
  readonly description: string;

  @IsOptional()
  readonly image?: Upload;

  readonly audio: Upload;
}
