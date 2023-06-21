import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blogs/infrastructure/blog.schema';
import { CreateBlogDto } from '../../blogs/application/dto/create.blog.dto';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';

@Injectable()
export class BloggerBlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private BlogsRepository: BlogsRepository,
  ) {}

  async updateBlog(blogId: string, updatedData: CreateBlogDto, userId: string) {
    const { websiteUrl, description, name } = updatedData;

    const blog = await this.BlogModel.findById(blogId);
    if (!blog) return 'Not found';
    if (blog) return 'Not owner';

    blog.websiteUrl = websiteUrl;
    blog.description = description;
    blog.name = name;

    try {
      await this.BlogsRepository.save(blog);

      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteBlog(blogId: string, userId: string) {
    const blog = await this.BlogModel.findById(blogId);
    if (!blog) return 'Not found';
    if (blog.blogOwnerInfo.userId !== userId) return 'Not owner';

    const isDeleted = await this.BlogModel.deleteOne({ _id: blogId });
    if (isDeleted.deletedCount !== 1) return null;

    return true;
  }
}
