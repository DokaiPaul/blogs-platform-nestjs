import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async createBlog(newBlog) {
    const createdBlog = new this.BlogModel(newBlog);
    return createdBlog.save();
  }

  deleteBlogById(blogId: string) {
    return this.BlogModel.deleteOne({ _id: new ObjectId(blogId) });
  }

  async save(blog: BlogDocument) {
    await blog.save();
  }
}
