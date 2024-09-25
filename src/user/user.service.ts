import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return this.userModel.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign({ id: user._id });

    return { accessToken };
  }

  // async findById(id: string): Promise<User> {
  //   return this.userModel.findById(id);
  // }

  async getUserProfile(userId: string): Promise<ProfileDto> {
    const user = await this.userModel
      .findById(userId)
      .select('username surname email name');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
