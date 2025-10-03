import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "./workers/notificationWorker";
import NotificationHandler from "./Handlers/NotificationHandler";


const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", methods: ["GET"] } },)



notificationsWorker.on("completed", async job => {
    await NotificationHandler.Send(Number(job.data.id_destinatario))
})


io.on("connection", (socket) => {
    const handler = new NotificationHandler(socket)

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