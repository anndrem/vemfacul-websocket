import WebSocket from "ws";

import { Socket } from "socket.io";
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "./workers/notificationWorker";
import { handleMessage } from "./Handles/NotificatiosHandler";
import NotificationsRepository from "./repositories/Notifications";

const handleEvent = new handleMessage(new NotificationsRepository())

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", methods: ["GET"] } },)



const clients: { socket: Socket, id_user?: number }[] = []


const sendNotificatio = async (socket: Socket, id_user: number) => {
    try {
        const n_notification = await handleEvent.getNotifications(id_user);
        socket.emit("io_notifications", n_notification);
        console.log(`🔔 Notificações enviadas para usuário \x1b[32m${id_user}\x1b[0m`);
    } catch (err) {
        socket.emit("INTERNAL_ERROR", `erro ao buscar notificações: ${err}`);
    }
}


io.on("connection", (socket) => {
    console.log(`user connected`)
    const client: { socket: Socket, id_user?: number } = { socket };
    clients.push(client)

    socket.on("register", (id_user) => {
        client.id_user = id_user
        console.log(`✅ Usuário registrado: ${id_user}`);
    })

    notificationsWorker.on("completed", async job => {
        const id_destinatario = Number(job.data.id_destinatario)
        const targetClient = clients.find(c => c.id_user === id_destinatario)
    
        if (targetClient) {
            return await sendNotificatio(targetClient.socket, id_destinatario)
        }
    })
    
    socket.on("disconnect", () => {
        const idx = clients.findIndex(c => c.socket === socket)
        if (idx !== -1) clients.splice(idx, 1)
        console.log("🔴 Cliente desconectado:", socket.id);
    })
})


httpServer.listen(process.env.PORT || 3002, () => {
    console.log(`🔗 Servidor ioSocket iniciado na porta ${process.env.PORT}`);
})