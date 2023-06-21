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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
    MongooseModule.forFeature([
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
    SuperAdminUsersController,
    BloggerBlogsController,
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
    CommentsRepository,
    CommentsService,
    EmailsManager,
    EmailAdapter,
    AuthService,
    ActiveSessionService,
    ActiveSessionRepository,
    JwtService,
    IsBlogExistConstraint,
    BanUserUseCaseService,
    SaBlogsService,
    BloggerBlogsService,
  ],
})
export class AppModule {}
