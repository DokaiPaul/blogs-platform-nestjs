import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogInputModel } from '../api/models/input/blog.input.model';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  createBlog(blogData: BlogInputModel) {
    const newBlog = {
      ...blogData,
    };

    return this.blogsRepository.createBlog(newBlog);
  }

  updateBlogById(blogId: string) {
    return this.blogsRepository.updateBlogById(blogId);
  }

  deleteBlogById(blogId: string) {
    return this.blogsRepository.deleteBlogById(blogId);
  }
}
