import { Injectable } from '@nestjs/common';
import { QueryParamsModel } from '../api/models/input/query.params.model';
@Injectable()
export class BlogsQueryRepository {
  getBlogs(queryParams?: QueryParamsModel) {
    if (!queryParams) return 'first 10 blogs';

    const { searchNameTerm, sortBy, sorDirection, pageNum, pageSize } =
      this.getQueryParams(queryParams);

    const filter = !searchNameTerm
      ? {} //if search name term is not provided
      : { name: { $regex: searchNameTerm, $options: 'i' } };

    const sort = { [sortBy]: sorDirection };
  }

  getBlogById(blogId: string, queryParams?: QueryParamsModel) {
    return {};
  }
  //define default values if the values are not provided in query params
  getQueryParams(queryParams: QueryParamsModel) {
    const searchNameTerm = queryParams.searchNameTerm ?? null;
    const sortBy = queryParams.sortBy ?? 'createdAt';
    const sorDirection = queryParams.sortDirection ?? 'desc';
    const pageNum = queryParams.pageNumber ?? 1;
    const pageSize = queryParams.pageSize ?? 10;

    return {
      searchNameTerm,
      sortBy,
      sorDirection,
      pageNum,
      pageSize,
    };
  }
}
