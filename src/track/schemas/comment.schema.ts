import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Track } from './track.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  text: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' } })
  track: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
