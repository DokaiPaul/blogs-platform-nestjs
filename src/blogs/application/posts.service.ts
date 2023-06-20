import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto, CreatePostWithBlogIdDto } from './dto/create.post.dto';
import { LikeStatus } from '../api/models/view/likes.info.view.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { Post, PostDocument } from '../infrastructure/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostLikeStatusDto } from './dto/set.like.status.dto';

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
    createdBy: string,
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
      userId: createdBy,
    };
    const { userId, ...postWithoutUserId } = newPost;

    const createdPost = await this.PostsRepository.createPost({
      ...newPost,
      likes: [],
      dislikes: [],
    });

    return {
      id: createdPost._id.toString(),
      ...postWithoutUserId,
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

  async setLikeStatus(likeDto: PostLikeStatusDto) {
    const { status, postId, userId } = likeDto;
    let currentStatus = 'None';

    const isAlreadyLiked = await this.PostsRepository.findLikeByUser({
      userId,
      postId,
    });
    if (isAlreadyLiked) currentStatus = 'Like';

    const isAlreadyDisliked = await this.PostsRepository.findDislikeByUser({
      userId,
      postId,
    });
    if (isAlreadyDisliked) currentStatus = 'Dislike';

    if (currentStatus === status) return null;

    if (currentStatus === 'None') {
      const result = await this.addNewLikeStatus(likeDto);
      return result;
    } else {
      const result = await this.changeCurrentLikeStatus(likeDto);
      return result;
    }
  }

  async addNewLikeStatus({ status, ...dataAboutStatus }: PostLikeStatusDto) {
    if (status === 'Like') {
      const result = await this.PostsRepository.addLike(dataAboutStatus);
      if (!result) return null;
      return true;
    }
    if (status === 'Dislike') {
      const result = await this.PostsRepository.addDislike(dataAboutStatus);
      if (!result) return null;
      return true;
    }

    return null;
  }

  async changeCurrentLikeStatus({
    status,
    postId,
    userId,
    login,
  }: PostLikeStatusDto) {
    const addStatusDto = { userId, postId, login };
    const removeOrFindStatusDto = { userId, postId };

    if (status === 'Like') {
      const result = await this.PostsRepository.addLike(addStatusDto);
      if (!result) return null;

      const isRemoved = await this.PostsRepository.removeDislike(
        removeOrFindStatusDto,
      );
      if (!isRemoved) return null;

      return true;
    }

    if (status === 'Dislike') {
      const result = await this.PostsRepository.addDislike(addStatusDto);
      if (!result) return null;

      const isRemoved = await this.PostsRepository.removeLike(
        removeOrFindStatusDto,
      );
      if (!isRemoved) return null;

      return true;
    }

    if (status === 'None') {
      const isLiked = await this.PostsRepository.findLikeByUser(
        removeOrFindStatusDto,
      );
      if (isLiked) {
        const result = await this.PostsRepository.removeLike(
          removeOrFindStatusDto,
        );
        if (!result) return null;

        return true;
      }

      const isDisliked = await this.PostsRepository.findDislikeByUser(
        removeOrFindStatusDto,
      );
      if (isDisliked) {
        const result = await this.PostsRepository.removeDislike(
          removeOrFindStatusDto,
        );
        if (!result) return null;

        return true;
      }
    }

    return null;
  }
}
