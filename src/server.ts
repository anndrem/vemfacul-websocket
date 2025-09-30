import wss from "./WebSocket/WS";
import WebSocket from "ws";
import notificationsWorker from "./workers/notificationWorker";
import { handleMessage } from "./Handles/NotificatiosHandler";
import NotificationsRepository from "./repositories/Notifications";

const handleEvent = new handleMessage(new NotificationsRepository())



const clients: { ws: WebSocket, id_user?: number }[] = []


wss.on("connection", (ws: WebSocket) => {
    console.log(`user connected`)
    const client: { ws: WebSocket, id_user?: number } = { ws };
    clients.push(client)

    notificationsWorker.on("failed", () => ws.send("erro em inserir notificação"))

    notificationsWorker.on("completed", async job => {
        try {
            client.id_user = Number(JSON.parse(job.data.id_destinatario))
            if (typeof client.id_user !== "number") { ws.send("id_user invalido"); return null }

            console.log(`🔔 Nova notificação instantânea para o usuário: \x1b[32m${client.id_user}\x1b[0m`);
            const n_notification = await handleEvent.getNotifications(client.id_user)

            return ws.send(JSON.stringify(n_notification))
            
        } catch (err) {
            ws.send(`erro ao se conectar ${err}`)
        }
    })

    // ws.on("message", (msg: string) => {
    //     try {
    //         const ws_id_user = Number(JSON.parse(msg))
    //         client.id_user = (ws_id_user);

    //         notificationsWorker.on("completed", async job => {
    //             if (typeof client.id_user !== "number") { ws.send("id_user não definido ou inválido"); return null; }

    //             console.log("Pintou notificação:", job.id)
    //             return await handleEvent.getNotifications(ws, client.id_user);
    //         })
    //     } catch (err) { ws.send(`erro ao buscar notificação ${err}`) }
    // })

    ws.on("close", () => {
        const idx = clients.findIndex(c => c.ws === ws)
        if (idx !== -1) clients.splice(idx, 1)
        console.log("Cliente desconectado")
    })
})



console.log(`🔗 Servidor WebSocket iniciado na porta ${process.env.PORT}`);