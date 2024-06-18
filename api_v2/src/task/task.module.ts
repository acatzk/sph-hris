import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { SlackModule } from '@/slack/slack.module';

@Module({
  imports: [SlackModule],
  providers: [TaskService],
})
export class TaskModule {}
