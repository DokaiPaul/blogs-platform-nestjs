import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDto } from './dto/create.blog.dto';
import { BlogViewModel } from '../api/models/view/blog.view.model';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../infrastructure/blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';

@Injectable()
export class BlogsService {
  constructor(
    private BlogsRepository: BlogsRepository,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private UserQueryRepository: UsersQueryRepository,
  ) {}
  s;

  async createBlog(
    blogData: CreateBlogDto,
    userId?: string,
  ): Promise<BlogViewModel> {
    const { name, websiteUrl, description } = blogData;
    let blogOwnerData = {
      userId: null,
      userLogin: null,
    };
    if (userId) {
      let userLogin;
      const user = await this.UserQueryRepository.getUserById(userId);
      if (user) userLogin = user.login;

      blogOwnerData = { userId, userLogin };
    }

    const newBlog = {
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString(),
      isMembership: false,
      blogOwnerInfo: blogOwnerData,
      banInfo: {
        isBanned: false,
        banDate: null,
      },
    };

    const { blogOwnerInfo, ...blogWithoutOwnerInfo } = newBlog;

    const createdBlog = await this.BlogsRepository.createBlog(newBlog);

    return {
      id: createdBlog._id.toString(),
      ...blogWithoutOwnerInfo,
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
