import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { Model, SortOrder } from 'mongoose';
import {
  CommentToBloggerViewModel,
  CommentViewModel,
} from '../api/models/view/comment.view.model';
import { LikeStatus } from '../api/models/view/likes.info.view.model';
import { QueryCommentParamsModel } from '../api/models/input/query.params.model';
import { Blog, BlogDocument } from './blog.schema';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
  ) {}

  async getAllCommentsInUserBlogs(
    userId: string,
    queryParams: QueryCommentParamsModel,
  ) {
    const { sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const allBloggersBlogs = await this.BlogModel.find({
      'blogOwnerInfo.userId': userId,
    });
    if (!allBloggersBlogs) throw new NotFoundException();
    const blogsIds = allBloggersBlogs.map((b) => b._id.toString());

    const sort = { [sortBy]: sorDirection as SortOrder };
    const filter: any = {
      $and: [
        {
          isHidden: false,
        },
        {
          'postInfo.blogId': { $in: blogsIds },
        },
      ],
    };

    const comments =
      (await this.CommentModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? [];

    const commentsToViewModel = comments.map((c) =>
      this.convertToCommentView(c, 'Blogger', userId),
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

  async getCommentsInPost(
    queryParams?: QueryCommentParamsModel,
    postId?: string,
    userId?: string,
  ) {
    const { sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const sort = { [sortBy]: sorDirection as SortOrder };
    let filter: any = { isHidden: false };
    if (postId) filter = { $and: [{ postId: postId }, { isHidden: false }] }; //if postId is passed

    const comments =
      (await this.CommentModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? [];

    const commentsToViewModel = comments.map((c) =>
      this.convertToCommentView(c, 'User', userId),
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
    const comment = await this.CommentModel.findOne({
      $and: [{ _id: commentId }, { isHidden: false }],
    });
    if (!comment) return null;

    return this.convertToCommentView(comment, 'User', userId);
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
    comment: CommentDocument,
    requestBy: string,
    userId?,
  ): CommentViewModel | CommentToBloggerViewModel {
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

    const commentToUser = {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likes.filter((c) => !c.isHidden).length,
        dislikesCount: comment.dislikes.length,
        myStatus,
      },
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
    };

    if (requestBy === 'Blogger') {
      return {
        ...commentToUser,
        postInfo: {
          id: comment.postInfo.id,
          title: comment.postInfo.title,
          blogId: comment.postInfo.blogId,
          blogName: comment.postInfo.blogName,
        },
      };
    }

    return commentToUser;
  }
}
