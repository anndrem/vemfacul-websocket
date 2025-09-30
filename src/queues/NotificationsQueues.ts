import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.IOREDIS_URL ?? "", { maxRetriesPerRequest: null });


export const notificationQueue = new Queue("notificationsQueue", { connection })
