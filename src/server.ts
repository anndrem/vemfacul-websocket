import wss from "./WebSocket/WS";
import WebSocket from "ws";
import { handleMessage } from "./Handles/NotificatiosHandler";
import NotificationsRepository from "./repositories/Notifications";

const handleEvent = new handleMessage(new NotificationsRepository())

const clients: { ws: WebSocket, id_user?: number }[] = []
wss.on("connection", (ws: WebSocket) => {
    console.log(`user connected`)
    const client: { ws: WebSocket, id_user?: number } = { ws };
    clients.push(client)

    ws.on("message", async (msg: string) => {
        try {
            const id_user: number = Number(msg.toString());
            client.id_user = id_user
            // await handleEvent.getNotifications(ws, id_user)

        } catch (err) {
            console.error("erro ao receber mensagem", err)
            ws.send(JSON.stringify("error"))
        }

        ws.on("close", () => {
            const idx = clients.findIndex(c => c.ws === ws)
            if (idx !== -1) clients.splice(idx, 1)
            console.log("Cliente desconectado")
        })
    })
})

setInterval(async () => {
    for (const client of clients) {
        if (client.id_user) {
            try {
                await handleEvent.getNotifications(client.ws, client.id_user)
            } catch (err) {
                console.error(err)
            }
        }
    }
}, 5000)

console.log(`🔗 Servidor WebSocket iniciado na porta ${process.env.PORT}`);