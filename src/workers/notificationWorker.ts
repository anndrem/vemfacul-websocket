import { Worker } from "bullmq"
import IORedis from "ioredis"
import NotificationsRepository from "../repositories/Notifications"
import { NotificationsService } from "../Services/NotificatiosServices"


const connection = new IORedis(process.env.IOREDIS_URL ?? "", { maxRetriesPerRequest: null })
const handleEvent = new NotificationsService(new NotificationsRepository())

const notificationsWorker = new Worker(
    "notificationsQueue",
    async job => {
        try {
            const {id_destinatario, id_actor, id_post, type} = job.data
            return (await handleEvent.createNotification(id_destinatario, id_actor, id_post, type))
        } catch (err) {
            console.error("erro ao inserir notificação", err)
        }
    }
, { connection })

export default notificationsWorker;