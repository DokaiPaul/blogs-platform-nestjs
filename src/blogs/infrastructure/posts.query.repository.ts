import { Injectable } from '@nestjs/common';
import { PostViewModel } from '../api/models/view/post.view.model';
import { QueryPostParamsModel } from '../api/models/input/query.params.model';
import { Post, PostDocument } from './post.schema';
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
    userId?: string,
  ): Promise<PaginatorViewModel<PostViewModel | []>> {
    const { sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const sort = { [sortBy]: sorDirection as SortOrder };
    let filter: any = { isHidden: false };
    if (blogId) filter = { $and: [{ blogId: blogId }, { isHidden: false }] }; //set filter to extract posts only for particular blog

    const posts =
      (await this.PostModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? []; //return an empty array if there are no required blogs in DB

    const postsToViewModel = posts.map((p) =>
      this.convertToPostView(p, userId),
    );

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
    const post = await this.PostModel.findOne({
      $and: [{ _id: postId }, { isHidden: false }],
    });
    if (!post?._id) return null;

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

  private convertToPostView(post: PostDocument, userId?): PostViewModel {
    let myStatus = LikeStatus.None;

    if (userId) {
      const isLiked = post.likes?.find((u) => u.userId.toString() === userId);
      const isDisliked = post.dislikes?.find(
        (u) => u.userId.toString() === userId,
      );

      if (isLiked) myStatus = LikeStatus.Like;
      if (isDisliked) myStatus = LikeStatus.Dislike;
    }

    const newestLikes = post.likes
      ?.filter((p) => !p.isHidden)
      ?.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
      .slice(0, 3);
    const processedLikes = newestLikes.map((p) => {
      return {
        login: p.login,
        userId: p.userId,
        addedAt: p.addedAt.toString(),
      };
    });

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likes.filter((p) => !p.isHidden).length,
        dislikesCount: post.dislikes.length,
        myStatus,
        newestLikes: processedLikes,
      },
    };
  }
}
