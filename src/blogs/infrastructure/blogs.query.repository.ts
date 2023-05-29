import { Injectable } from '@nestjs/common';
import { QueryBlogParamsModel } from '../api/models/input/query.params.model';
import { Blog, BlogDocument } from './blog.schema';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { BlogViewModel } from '../api/models/view/blog.view.model';
import { PaginatorViewModel } from '../api/models/view/paginator.view.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async getBlogs(
    queryParams?: QueryBlogParamsModel,
  ): Promise<PaginatorViewModel<BlogViewModel | []>> {
    const { searchNameTerm, sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const filter = !searchNameTerm
      ? {} //if search name term is not provided filter is an empty object
      : { name: { $regex: searchNameTerm, $options: 'i' } };

    const sort = { [sortBy]: sorDirection as SortOrder };

    const blogs =
      (await this.BlogModel.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip((pageNum - 1) * pageSize)) ?? []; //return an empty array if there are no required blogs in DB

    const blogsToViewModel = blogs.map((b) => this.convertToViewBlog(b));

    const totalMatchedPosts = await this.BlogModel.countDocuments(filter);
    const totalPages = Math.ceil(totalMatchedPosts / pageSize);

    return {
      pagesCount: totalPages,
      page: pageNum,
      pageSize: pageSize,
      totalCount: totalMatchedPosts,
      items: blogsToViewModel,
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.BlogModel.findById(blogId);
    if (!blog) return null;

    return this.convertToViewBlog(blog);
  }

  //define default values if the values are not provided in query params
  private getQueryParams(queryParams: QueryBlogParamsModel) {
    const propertyKeys = [
      'id',
      'name',
      'description',
      'websiteUrl',
      'createdAt',
      'isMembership',
    ];

    const searchNameTerm = queryParams.searchNameTerm ?? null;
    let sortBy = 'createdAt';
    const sorDirection = queryParams.sortDirection ?? 'desc';
    const pageNum = +queryParams.pageNumber || 1; //if passed param is equal to 0/null or undefined, the default value will be 1
    const pageSize = +queryParams.pageSize || 10; //if passed param is equal to 0/null or undefined, the default value will be 10

    if (queryParams.sortBy && propertyKeys.includes(queryParams.sortBy)) {
      sortBy = queryParams.sortBy;
    }

    return {
      searchNameTerm,
      sortBy,
      sorDirection,
      pageNum,
      pageSize,
    };
  }

  private convertToViewBlog(dto: Blog & { _id: ObjectId }): BlogViewModel {
    return {
      id: dto._id.toString(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: dto.createdAt,
      isMembership: dto.isMembership,
    };
  }
}
