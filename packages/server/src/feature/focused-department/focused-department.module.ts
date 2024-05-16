import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FocusedDepartmentSchema } from '@awamstock/model'
import { FocusedDepartmentService } from './focused-department.service'
import { FocusedDepartmentController } from './focused-department.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FocusedDepartment', schema: FocusedDepartmentSchema }])],
  providers: [FocusedDepartmentService],
  controllers: [FocusedDepartmentController],
})
export class FocusedDepartmentModule {}
