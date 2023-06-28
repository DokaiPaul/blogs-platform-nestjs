export type QueryBlogParamsModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryPostParamsModel = Omit<QueryBlogParamsModel, 'searchNameTerm'>;

export type QueryCommentParamsModel = Omit<
  QueryBlogParamsModel,
  'searchNameTerm'
>;

export type QueryBannedUsersInBlogModel = Omit<
  QueryBlogParamsModel,
  'searchNameTerm'
> & {
  searchLoginTerm?: string;
};

export type QueryUserParamsModel = Omit<
  QueryBlogParamsModel,
  'searchNameTerm'
> & {
  banStatus?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
