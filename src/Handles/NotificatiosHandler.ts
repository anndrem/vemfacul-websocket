import NotificationsRepository from "../repositories/Notifications";

export class handleMessage {
    constructor(private repository: NotificationsRepository) { }

    async createNotification(id_destinatario: number, id_actor: number, id_post: number, type: string) {
        if (!id_destinatario || !id_post || !type) { throw new Error("MISSIN_DEPENDENCY"); }

        const result = await this.repository.insertNotifications(id_destinatario, id_actor, id_post, type)
        return result.rows[0].id_user
    }
    async getNotifications(id_user: number) {
        let response: number;
        if (!id_user) {throw new Error("id_user nao pode ser vaizo") ;}
        
        const result = await this.repository.selectNotifications(id_user)
        response = Number(result.rows[0].notifications)

        return response
    }
}