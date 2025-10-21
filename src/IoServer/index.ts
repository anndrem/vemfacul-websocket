import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import notificationsWorker from "../workers/NotificationWorker";
import NotificationHandler from "../Handlers/NotificationHandler";
import { socketAuth } from "../middleware/socketAuth";

const app = express()
const httpServer = createServer(app)

class Io {
    private io: Server;

    constructor() {
        this.io = new Server(httpServer, { cors: { origin: ["http://localhost:3000", "https://vemfacul.com", "https://chapaera.org"], methods: ["GET"], credentials: true } },)
        this.io.use(socketAuth)
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

            const user = socket.data.user
            console.log("🟢 Cliente Conectado: " + user.id)

            handler.Register(+user.id)

            socket.on("disconnect", () => {
                handler.Disconnect()
            })
        });
    }
}

const IoServer = new Io()

export { app, httpServer, IoServer } 