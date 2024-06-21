import { BullModuleOptions, BullOptionsFactory } from "@nestjs/bull";

export class BullConfigService implements BullOptionsFactory {

    createBullOptions(): BullModuleOptions {
        return {
            redis: {
                host: process.env.QUEUE_HOST || 'localhost',
                port: process.env.QUEUE_PORT ? parseInt(process.env.QUEUE_PORT) : 6379
            }
        }
    }
}