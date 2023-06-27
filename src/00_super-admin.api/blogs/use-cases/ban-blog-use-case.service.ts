import { Injectable } from '@nestjs/common';
import { BanBlogInputDto } from '../dto/ban-blog-input.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../../blogs/infrastructure/blog.schema';
import { Model } from 'mongoose';
import { PostsRepository } from '../../../blogs/infrastructure/posts.repository';
import { CommentsRepository } from '../../../blogs/infrastructure/comments.repository';

@Injectable()
export class BanBlogUseCaseService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private PostRepository: PostsRepository,
    private CommentRepository: CommentsRepository,
  ) {}

  async changeBanStatusByBlogId(blogId: string, inputDto: BanBlogInputDto) {
    const isBlogStatusChanged = await this.changeBlogBanStatus(
      blogId,
      inputDto.isBanned,
    );
    if (!isBlogStatusChanged) return null;

    const isPostStatusChanged = await this.changeHideStatusInPostsByBlogId(
      blogId,
      inputDto.isBanned,
    );
    if (!isPostStatusChanged) return null;

    const isCommentsStatusChanged =
      await this.changeHideStatusInCommentsByBlogId(blogId, inputDto.isBanned);
    if (!isCommentsStatusChanged) return null;

    return true;
  }

  private async changeBlogBanStatus(blogId: string, status: boolean) {
    const blog = await this.BlogModel.findById(blogId);

    try {
      blog.isHidden = status;
      blog.save();

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private async changeHideStatusInPostsByBlogId(
    blogId: string,
    status: boolean,
  ) {
    const result = await this.PostRepository.changeHideStatusAllPostsByBlogId(
      blogId,
      status,
    );

    return result;
  }

  private async changeHideStatusInCommentsByBlogId(
    blogId: string,
    status: boolean,
  ) {
    const result =
      await this.CommentRepository.changeHideStatusAllCommentsByBlogId(
        blogId,
        status,
      );

    return result;
  }
}
