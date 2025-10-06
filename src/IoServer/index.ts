import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "../workers/notificationWorker";
import NotificationHandler from "../Handlers/NotificationHandler";


const app = express()
const httpServer = createServer(app)


class Io {
    private io: Server;

    constructor() {
        this.io = new Server(httpServer, { cors: { origin: "http://localhost:3000", methods: ["GET"], credentials: true } },)
        this.setUpWorker();
        this.setUpServer();
    }

    private setUpWorker() {
        notificationsWorker.on("completed", async job => {
            await NotificationHandler.Send(Number(job.data.id_destinatario))
        })
    };

    private setUpServer() {
        this.io.on("connection", (socket) => {
            const handler = new NotificationHandler(socket)

            console.log("cliente conectado")

            socket.on("register", (id_user: number) => {
                handler.Register(Number(id_user))
            })

            socket.on("disconnect", () => {
                handler.Disconnect()
            })
        });
    }
}

const IoServer = new Io()

export { app, httpServer, IoServer } 