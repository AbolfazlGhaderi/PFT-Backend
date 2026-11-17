import { Module } from '@nestjs/common';

import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';

// repositories come from the global DatabaseModule, no forFeature needed
@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
