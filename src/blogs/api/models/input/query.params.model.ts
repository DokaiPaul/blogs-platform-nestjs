export type QueryBlogParamsModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryPostParamsModel = Omit<QueryBlogParamsModel, 'searchNameTerm'>;

export type QueryUserParamsModel = Omit<
  QueryBlogParamsModel,
  'searchNameTerm'
> & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
