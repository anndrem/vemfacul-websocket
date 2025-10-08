import { Socket } from "socket.io";
import { NotificationsService } from "../services/NotificatiosServices";
import NotificationsRepository from "../repositories/Notifications";

const service = new NotificationsService(new NotificationsRepository())

const clients: { socket: Socket, id_user?: number }[] = []

export class NotificationHandler {
    private socket: Socket

    constructor(socket: Socket) {
        this.socket = socket;
    }


    async Register(id_user: number) {
        const exists = clients.find(c => c.id_user === id_user)
        if (exists) { console.log("Esse já cliente existe"); return; }

        clients.push({ socket: this.socket, id_user })
        console.table(clients.map(c => ({ socket_id: c.socket.id, id_user: c.id_user })))
    }

    static async Send(id_destinatario: number) {
        const targetClient = clients.find(c => c.id_user === id_destinatario)

        if (!targetClient) { console.log("Cliente nao conectado"); return }

        try {
            const n_notification = await service.getNotifications(id_destinatario);
            targetClient.socket.emit("notifications", n_notification)
            console.log(`🔔 Notificações enviadas para usuário \x1b[32m${id_destinatario}\x1b[0m`);

        } catch (err) {
            console.error(`Erro ao enviar notificações para usuário ${id_destinatario}:`, err);
        }
    }

    Disconnect() {
        const idx = clients.findIndex(c => c.socket === this.socket)
        if (idx !== -1) clients.splice(idx, 1)
        console.log("🔴 Cliente desconectado:", this.socket.id);
    }

}

export default NotificationHandler; 