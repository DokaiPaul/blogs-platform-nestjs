import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostInBlogInputModel } from '../api/models/input/post.input.model';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  createPost(blogId: string, postData: PostInBlogInputModel) {
    const newPost = {
      id: 'ObjectId',
      ...postData,
    };

    return this.postsRepository.createPost(newPost);
  }

  updatePostById(postId: string) {
    return this.postsRepository.updatePostById(postId);
  }

  deletePostById(postId: string) {
    return this.postsRepository.deletePostById(postId);
  }

  deletePostsInBlog(blogId: string) {
    return this.postsRepository.deletePostsInBlog(blogId);
  }
}
