import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsController } from './blogs/api/posts.controller';
import { CommentsController } from './blogs/api/comments.controller';
import { TestingController } from './testing/testing.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query.repository';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query.repository';
import { PostsService } from './blogs/application/posts.service';
import { PostsRepository } from './blogs/infrastructure/posts.repository';
import { PostsQueryRepository } from './blogs/infrastructure/posts.query.repository';
import { CommentsQueryRepository } from './blogs/infrastructure/comments.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Blog, BlogSchema } from './blogs/infrastructure/blog.schema';
import { Post, PostSchema } from './blogs/infrastructure/post.schema';
import { Comment, CommentSchema } from './blogs/infrastructure/comments.schema';
import { User, UserSchema } from './users/infrastructure/users.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingController,
  ],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
  ],
})
export class AppModule {}
