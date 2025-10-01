import { Socket } from "socket.io";
import { NotificationsService } from "../Services/NotificatiosServices";
import NotificationsRepository from "../repositories/Notifications";

const service = new NotificationsService(new NotificationsRepository())

const clients: { socket: Socket, id_user?: number }[] = []

export class handlerEvent {
    constructor(private socket: Socket) { }

    async Register(id_user: number) {
        const client: { socket: Socket, id_user?: number } = { socket: this.socket }
        clients.push(client)
        console.log(`cliente: ${id_user} registrado`)
        return client.id_user = id_user
    }

    async SendNotification(id_destinatario: number) {
        const id_user = id_destinatario
        const targetClient = clients.find(c => c.id_user === id_destinatario)

        if (!targetClient) { return; }

        try {
            const n_notification = await service.getNotifications(id_user);
            console.log(`🔔 Notificações enviadas para usuário \x1b[32m${id_user}\x1b[0m`);
            return targetClient.socket.emit("notifications", n_notification);
        } catch (err) {
            throw err
        }
    }

    async Disconnect() {
        const idx = clients.findIndex(c => c.socket === this.socket)
        if (idx !== -1) clients.splice(idx, 1)
        console.log("🔴 Cliente desconectado:", this.socket.id);
    }

}

export default handlerEvent