import { Worker } from "bullmq"
import IORedis from "ioredis"
import NotificationsRepository from "../repositories/NotificationsRepository"
import { NotificationsService } from "../services/NotificationsServices"


const connection = new IORedis(process.env.IOREDIS_URL ?? "", { maxRetriesPerRequest: null })
const handleEvent = new NotificationsService(new NotificationsRepository())

const notificationsWorker = new Worker(
    "notificationsQueue",
    async job => {
        try {
            if (job.data.type === "Redação") {
                const { id_user, content, type } = job.data
                console.log(job.data)
                return await handleEvent.insertEssayNotification(id_user, content, type)
            }
            const { id_destinatario, id_actor, id_post, type } = job.data
            return (await handleEvent.createNotification(id_destinatario, id_actor, id_post, type))
        } catch (err) {
            console.error("Erro ao inserir notificação", err)
        }
    }
    , { connection })

notificationsWorker.on("completed", job => {
    console.log(`✅ Job ${job.id} concluído`);
});

notificationsWorker.on("ready", () => {
    console.log(`✅ Notifications Worker rodando!`)
})

notificationsWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} falhou:`, err);
});

export default notificationsWorker;