import { Controller, Delete } from '@nestjs/common';

@Controller('testing/all-data')
export class TestingController {
  @Delete()
  clearAllData() {
    return true;
  }
}
