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
import { EmailsManager } from './managers/email.sender.manager';
import { EmailAdapter } from './adapters/email.adapter';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import {
  ActiveSession,
  ActiveSessionSchema,
} from './devices/active.sessions.model';
import { ActiveSessionService } from './devices/active.sessions.service';
import { ActiveSessionRepository } from './devices/active.sessions.repository';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './users/infrastructure/password.recovery.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommentsRepository } from './blogs/infrastructure/comments.repository';
import { CommentsService } from './blogs/application/comments.service';
import { AuthModule } from './auth/auth.module';
import { IsBlogExistConstraint } from './utilities/custom.validators/is.blog.exist';
import { SecurityDevicesController } from './devices/security.devices.controller';
import { SuperAdminUsersController } from './00_super-admin.api/users/sa.users.controller';
import { BanUserUseCaseService } from './00_super-admin.api/users/use-cases/ban-user-use-case.service';
import { BloggerBlogsController } from './01_blogger.api/blogs/blogger.blogs.controller';
import { BloggerBlogsService } from './01_blogger.api/blogs/blogger.blogs.service';
import { SaBlogsService } from './00_super-admin.api/blogs/sa.blogs.service';
import { SuperAdminBlogsController } from './00_super-admin.api/blogs/sa.blogs.controller';
import { BanBlogUseCaseService } from './00_super-admin.api/blogs/use-cases/ban-blog-use-case.service';
import { BloggerUsersController } from './01_blogger.api/users/blogger.users.controller';
import { BanUserInBlogUseCaseService } from './01_blogger.api/users/use-cases/ban-user-in-blog-use-case.service';

const useCases = [
  BanBlogUseCaseService,
  BanUserUseCaseService,
  BanUserInBlogUseCaseService,
];
const repositories = [
  UsersRepository,
  BlogsRepository,
  PostsRepository,
  CommentsRepository,
  ActiveSessionRepository,
];
const queryRepositories = [
  UsersQueryRepository,
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: ActiveSession.name, schema: ActiveSessionSchema },
    ]),
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingController,
    AuthController,
    SecurityDevicesController,
    SuperAdminUsersController,
    SuperAdminBlogsController,
    BloggerBlogsController,
    BloggerUsersController,
  ],
  providers: [
    UsersService,
    BlogsService,
    PostsService,
    CommentsService,
    EmailsManager,
    EmailAdapter,
    AuthService,
    ActiveSessionService,
    JwtService,
    IsBlogExistConstraint,
    SaBlogsService,
    BloggerBlogsService,
    ...queryRepositories,
    ...repositories,
    ...useCases,
  ],
})
export class AppModule {}
