import { BanUserInputDto } from '../../../00_super-admin.api/users/dto/ban-user-input.dto';
import { IsMongoId, IsString } from 'class-validator';

export class BanUserInBlogDto extends BanUserInputDto {
  @IsString()
  @IsMongoId()
  blogId: string;
}
