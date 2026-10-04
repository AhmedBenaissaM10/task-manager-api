import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProjectsModule } from './projects/projects.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.js';
import { validateEnv } from './config/env.schema.js';
import { TagsModule } from './tags/tags.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const databaseConfig = config.get('database') as Record<string, any>;
        return {
          type: 'postgres',
          ...databaseConfig,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    ProjectsModule,
    TasksModule,
    TagsModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'school-api',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
