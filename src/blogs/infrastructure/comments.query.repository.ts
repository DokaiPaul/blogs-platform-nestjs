import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model, SortOrder } from 'mongoose';
import { CommentViewModel } from '../api/models/view/comment.view.model';
import { LikeStatus } from '../api/models/view/likes.info.view.model';
import { QueryCommentParamsModel } from '../api/models/input/query.params.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async getCommentsInPost(
    queryParams?: QueryCommentParamsModel,
    postId?: string,
    userId?: string,
  ) {
    const { sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const sort = { [sortBy]: sorDirection as SortOrder };
    let filter = {};
    if (postId) filter = { postId: postId }; //if postId is passed

    const comments =
      (await this.CommentModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? [];

    const commentsToViewModel = comments.map((c) =>
      this.convertToCommentView(c, userId),
    );

    const totalMatchedPosts = await this.CommentModel.countDocuments(filter);
    const totalPages = Math.ceil(totalMatchedPosts / pageSize);

    return {
      pagesCount: totalPages,
      page: pageNum,
      pageSize: pageSize,
      totalCount: totalMatchedPosts,
      items: commentsToViewModel,
    };
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentViewModel | null> {
    const comment = await this.CommentModel.findById(commentId);
    if (!comment) return null;

    let myStatus = 'None' as LikeStatus;

    if (userId) {
      if (comment.likes.find((l) => l.userId === userId))
        myStatus = 'Like' as LikeStatus;
      if (comment.dislikes.find((d) => d.userId === userId))
        myStatus = 'Dislike' as LikeStatus;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: comment.likes.length,
        dislikesCount: comment.dislikes.length,
        myStatus,
      },
    };
  }

  private getQueryParams(queryParams: QueryCommentParamsModel) {
    const propertyKeys = [
      'id',
      'content',
      'createdAt',
      'commentatorInfo',
      'likesInfo',
    ];

    const sorDirection = queryParams?.sortDirection ?? 'desc';
    const pageNum = +queryParams?.pageNumber || 1; //if passed param is equal to 0/null or undefined, the default value will be 1
    const pageSize = +queryParams?.pageSize || 10; //if passed param is equal to 0/null or undefined, the default value will be 10
    let sortBy = 'createdAt';

    if (queryParams?.sortBy && propertyKeys.includes(queryParams?.sortBy)) {
      sortBy = queryParams.sortBy;
    }

    return {
      sortBy,
      sorDirection,
      pageNum,
      pageSize,
    };
  }

  private convertToCommentView(
    comment: Comment & { _id: ObjectId },
    userId?,
  ): CommentViewModel {
    let myStatus = LikeStatus.None;

    if (userId) {
      const isLiked = comment.likes?.find(
        (u) => u.userId.toString() === userId,
      );
      const isDisliked = comment.dislikes?.find(
        (u) => u.userId.toString() === userId,
      );

      if (isLiked) myStatus = LikeStatus.Like;
      if (isDisliked) myStatus = LikeStatus.Dislike;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likes.length,
        dislikesCount: comment.dislikes.length,
        myStatus,
      },
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
    };
  }
}
