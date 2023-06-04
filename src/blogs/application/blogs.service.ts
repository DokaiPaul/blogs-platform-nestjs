import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDto } from './dto/create.blog.dto';
import { BlogViewModel } from '../api/models/view/blog.view.model';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../infrastructure/blog.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
  constructor(
    private BlogsRepository: BlogsRepository,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
  ) {}
  s;

  async createBlog(blogData: CreateBlogDto): Promise<BlogViewModel> {
    const { name, websiteUrl, description } = blogData;

    const newBlog = {
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString(),
    };

    const createdBlog = await this.BlogsRepository.createBlog(newBlog);

    return {
      id: createdBlog._id.toString(),
      ...newBlog,
      isMembership: createdBlog.isMembership,
    };
  }

  async updateBlogById(blogId: string, updatedData: CreateBlogDto) {
    const { websiteUrl, description, name } = updatedData;

    const updatedBlog = await this.BlogModel.findById(blogId);
    if (!updatedBlog) return null;

    updatedBlog.websiteUrl = websiteUrl;
    updatedBlog.description = description;
    updatedBlog.name = name;

    try {
      await this.BlogsRepository.save(updatedBlog);

      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteBlogById(blogId: string) {
    const deletedBlog = await this.BlogsRepository.deleteBlogById(blogId);
    return deletedBlog.deletedCount === 1;
  }
}
