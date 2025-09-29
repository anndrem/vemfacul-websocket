// import type { ServerMessage } from "../db/types/WSType"
import WebSocket from "ws";
import NotificationsRepository from "../repositories/Notifications";

export class handleMessage {
    constructor(private repository: NotificationsRepository) { }

    async getNotifications(ws: WebSocket, data: number) {
        if (!data) throw ws.on("error", err => console.log("id_user nao pode ser vazio: ", err))

        const result = await this.repository.selectNotifications(data)
        let response: number = Number(result.rows[0].notifications)

        return ws.send(JSON.stringify(response))
    }
}