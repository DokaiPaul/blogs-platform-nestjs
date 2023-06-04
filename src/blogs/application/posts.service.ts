import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto, CreatePostWithBlogIdDto } from './dto/create.post.dto';
import { LikeStatus } from '../api/models/view/likes.info.view.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { Post, PostDocument } from '../infrastructure/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    private PostsRepository: PostsRepository,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    private BlogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createPost(
    blogId: string,
    postData: CreatePostWithBlogIdDto | CreatePostDto,
  ) {
    const { title, content, shortDescription } = postData;
    const blog = await this.BlogsQueryRepository.getBlogById(blogId);
    if (!blog) return null;

    const blogName = blog.name;

    const newPost = {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await this.PostsRepository.createPost({
      ...newPost,
      likes: [],
      dislikes: [],
    });

    return {
      id: createdPost._id,
      ...newPost,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  async updatePostById(postId: string, updatedData: CreatePostWithBlogIdDto) {
    const { title, content, shortDescription, blogId } = updatedData;

    const updatedPost = await this.PostModel.findById(postId);
    if (!updatedPost) return null;

    updatedPost.title = title;
    updatedPost.content = content;
    updatedPost.shortDescription = shortDescription;
    updatedPost.blogId = blogId;

    try {
      await this.PostsRepository.save(updatedPost);

      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deletePostById(blogId: string) {
    const deletedPost = await this.PostsRepository.deletePostById(blogId);
    return deletedPost.deletedCount === 1;
  }
}
