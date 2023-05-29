import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

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
}
