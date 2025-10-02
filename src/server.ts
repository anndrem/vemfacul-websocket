import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "./workers/notificationWorker";
import handlerEvents from "./Handlers/NotificationHandler";


const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", methods: ["GET"] } },)


const handlers: handlerEvents[] = []

notificationsWorker.on("completed", async job => {
    for (const h of handlers) await h.SendNotification(job.data.id_destinatario)
})


io.on("connection", (socket) => {
    const handler = new handlerEvents(socket, { socket })
    handlers.push(handler)

    handler.createClient();
    console.log("cliente conectado")

    socket.on("register", (id_user: number) => {
        handler.Register(Number(id_user))
    })

    socket.on("disconnect", () => {
        handler.Disconnect()
    })
})



httpServer.listen(process.env.PORT || 3002, () => {
    console.log(`🔗 Servidor ioSocket iniciado na porta ${process.env.PORT}`);
})