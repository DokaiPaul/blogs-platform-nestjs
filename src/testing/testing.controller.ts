import {
  Controller,
  Delete,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs/infrastructure/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../blogs/infrastructure/post.schema';
import {
  Comment,
  CommentDocument,
} from '../blogs/infrastructure/comments.schema';
import { User, UserDocument } from '../users/infrastructure/users.schema';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  @HttpCode(204)
  @Delete()
  async clearAllData() {
    try {
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      await this.CommentModel.deleteMany({});
      await this.UserModel.deleteMany({});

      return;
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
