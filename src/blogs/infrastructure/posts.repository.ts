import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  createPost(newPost) {
    return true;
  }

  updatePostById(postId: string) {
    return true;
  }

  deletePostById(postId: string) {
    return true;
  }

  deletePostsInBlog(blogId: string) {
    return true;
  }
}
