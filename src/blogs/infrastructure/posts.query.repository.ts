import { Injectable } from '@nestjs/common';
import { PostViewModel } from '../api/models/view/post.view.model';
import { QueryPostParamsModel } from '../api/models/input/query.params.model';
import { Post, PostDocument } from './post.schema';
import { ObjectId } from 'mongodb';
import { LikeStatus } from '../api/models/view/likes.info.view.model';
import { PaginatorViewModel } from '../api/models/view/paginator.view.model';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getPosts(
    queryParams?: QueryPostParamsModel,
    blogId?: string,
  ): Promise<PaginatorViewModel<PostViewModel | []>> {
    const { sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const sort = { [sortBy]: sorDirection as SortOrder };
    let filter = {};
    if (blogId) filter = { blogId: blogId }; //set filter to extract posts only for particular blog

    const posts =
      (await this.PostModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? []; //return an empty array if there are no required blogs in DB

    const postsToViewModel = posts.map((p) => this.convertToPostView(p)); //todo add user id as param when extract this id form cookeis

    const totalMatchedPosts = await this.PostModel.countDocuments(filter);
    const totalPages = Math.ceil(totalMatchedPosts / pageSize);

    return {
      pagesCount: totalPages,
      page: pageNum,
      pageSize: pageSize,
      totalCount: totalMatchedPosts,
      items: postsToViewModel,
    };
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.PostModel.findById(postId);
    if (!post) return null;

    return this.convertToPostView(post, userId);
  }

  private getQueryParams(queryParams: QueryPostParamsModel) {
    const propertyKeys = [
      'id',
      'title',
      'shortDescription',
      'content',
      'blogId',
      'blogName',
      'createdAt',
    ];

    const sorDirection = queryParams.sortDirection ?? 'desc';
    const pageNum = +queryParams.pageNumber || 1; //if passed param is equal to 0/null or undefined, the default value will be 1
    const pageSize = +queryParams.pageSize || 10; //if passed param is equal to 0/null or undefined, the default value will be 10
    let sortBy = 'createdAt';

    if (queryParams.sortBy && propertyKeys.includes(queryParams.sortBy)) {
      sortBy = queryParams.sortBy;
    }

    return {
      sortBy,
      sorDirection,
      pageNum,
      pageSize,
    };
  }

  private convertToPostView(
    post: Post & { _id: ObjectId },
    userId?,
  ): PostViewModel {
    let myStatus = LikeStatus.None;

    if (userId) {
      const isLiked = post.likes?.find((u) => u.userId.toString() === userId);
      const isDisliked = post.dislikes?.find(
        (u) => u.userId.toString() === userId,
      );

      if (isLiked) myStatus = LikeStatus.Like;
      if (isDisliked) myStatus = LikeStatus.Dislike;
    }

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likes.length,
        dislikesCount: post.dislikes.length,
        myStatus,
        newestLikes: post.likes
          ?.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
          .slice(0, 3),
      },
    };
  }
}
