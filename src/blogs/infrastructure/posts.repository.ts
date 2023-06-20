import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostLikeStatusDto } from '../application/dto/set.like.status.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async createPost(newPost: Post) {
    const post = await new this.PostModel(newPost);
    return post.save();
  }

  async deletePostById(blogId: string) {
    return this.PostModel.deleteOne({ _id: new ObjectId(blogId) });
  }

  async save(post: PostDocument) {
    await post.save();
  }

  async addLike({ postId, userId, login }: Omit<PostLikeStatusDto, 'status'>) {
    const post = await this.PostModel.findById(postId);
    post.likes.push({
      userId,
      login,
      addedAt: new Date().toISOString(),
      isHidden: false,
    });

    try {
      post.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async addDislike({
    postId,
    userId,
    login,
  }: Omit<PostLikeStatusDto, 'status'>) {
    const post = await this.PostModel.findById(postId);
    post.dislikes.push({
      userId,
      login,
      addedAt: new Date().toISOString(),
      isHidden: false,
    });

    try {
      post.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async removeLike({ userId, postId }) {
    return this.PostModel.updateOne(
      { _id: postId },
      { $pull: { likes: { userId: userId } } },
    );
  }

  async removeDislike({ userId, postId }) {
    return this.PostModel.updateOne(
      { _id: postId },
      { $pull: { dislikes: { userId: userId } } },
    );
  }

  async findLikeByUser({ postId, userId }: { postId: string; userId: string }) {
    return this.PostModel.findOne({
      _id: new Object(postId),
      likes: { $elemMatch: { userId: userId } },
    });
  }

  async findDislikeByUser({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) {
    return this.PostModel.findOne({
      _id: new Object(postId),
      dislikes: { $elemMatch: { userId: userId } },
    });
  }

  async changeHideStatusAllPostsByUserId(userId: string, hideStatus: boolean) {
    try {
      const result = await this.PostModel.updateMany(
        { userId: userId },
        { $set: { isHidden: hideStatus } },
      );

      return result.acknowledged;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async hideAllLikesByUserId(userId: string, hideStatus: boolean) {
    try {
      const result = await this.PostModel.updateMany(
        {
          likes: { $elemMatch: { userId: userId } },
        },
        { $set: { 'likes.$[like].isHidden': hideStatus } },
        { arrayFilters: [{ 'like.userId': userId }] },
      );

      return result.acknowledged;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
