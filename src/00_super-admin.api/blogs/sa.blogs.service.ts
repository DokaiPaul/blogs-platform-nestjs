import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blogs/infrastructure/blog.schema';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';

@Injectable()
export class SaBlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private BlogRepository: BlogsRepository,
  ) {}
  async bindBlogWithUser(blogId: string, userId: string) {
    if (!blogId || !userId) return null;

    const blog = await this.BlogModel.findById(blogId);

    if (!blog) return 'Not found';
    if (blog.blogOwnerInfo.userId !== null) return 'Already bound';

    blog.blogOwnerInfo.userId = userId;
    const isSaved = await this.BlogRepository.save(blog);

    return isSaved;
  }
}
