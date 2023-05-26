import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  getPosts(searchTerm?: string) {
    return [{}, {}];
  }

  getPostInBlog(blogId: string) {
    return [{}, {}];
  }

  getPostById(postId: string) {
    return {};
  }
}
