import { Socket } from "socket.io";
import { NotificationsService } from "../Services/NotificatiosServices";
import NotificationsRepository from "../repositories/Notifications";

const service = new NotificationsService(new NotificationsRepository())

const clients: { socket: Socket, id_user?: number }[] = []

export class handlerEvent {
    constructor(private socket: Socket, private client: { socket: Socket, id_user?: number }) { }

    async createClient() {
        this.client.socket = this.socket
    }

    async Register(id_user: number) {
        const exists = clients.find(c => c.id_user === id_user)

        if (exists) { return console.log("Esse cliente existe"); }

        this.client = { socket: this.socket, id_user };
        clients.push(this.client)
        console.table(clients)
    }

    async SendNotification(id_destinatario: number) {
        // isso ta errado
        
        const id_user = id_destinatario
        const targetClient = clients.find(c => c.id_user === id_destinatario)
        if (!targetClient) { return console.log("Cliente nao conectado"); }
        if (this.client.socket.id == targetClient.socket.id) { return null }

        try {
            const n_notification = await service.getNotifications(id_user);
            targetClient.socket.emit("notifications", n_notification)
            console.log(`🔔 Notificações enviadas para usuário \x1b[32m${id_user}\x1b[0m`);
        } catch (err) {
            console.error(`Erro ao enviar notificações para usuário ${id_user}:`, err);
        }
    }

     Disconnect() {
        const idx = clients.findIndex(c => c.socket === this.socket)
        if (idx !== -1) clients.splice(idx, 1)
        console.log("🔴 Cliente desconectado:", this.socket.id);
    }

}

export default handlerEvent; 