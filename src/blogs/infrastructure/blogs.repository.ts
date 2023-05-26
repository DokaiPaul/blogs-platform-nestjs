import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  createBlog(newBlog) {
    return true;
  }

  updateBlogById(blogId: string) {
    return true;
  }

  deleteBlogById(blogId: string) {
    return true;
  }
}
