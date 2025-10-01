import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "./workers/notificationWorker";
import handlerEvents from "./Handlers/NotificationHandler";


const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", methods: ["GET"] } },)


const handlers: handlerEvents[] = []
io.on("connection", (socket) => {
    const handler = new handlerEvents(socket)
    handlers.push(handler)
    console.log("cliente conectado")


    socket.on("register", (id_user: number) => {
        return handler.Register(Number(id_user))
    })

    notificationsWorker.on("completed", async job => {
        const n_notification = await handler.SendNotification(job.data.id_destinatario)
        socket.emit("notifications", n_notification)
    })

    socket.on("disconnect", () => {
        notificationsWorker.removeAllListeners("completed")
        return handler.Disconnect()
    })
})




httpServer.listen(process.env.PORT || 3002, () => {
    console.log(`🔗 Servidor ioSocket iniciado na porta ${process.env.PORT}`);
})