import pool from "../db/connect";

export default class NotificationsRepository {
  async insertNotifications(id_destinatario: number, id_actor: number, id_post: number, type: string) {
    const values = [id_destinatario, id_actor, id_post, type]
    const query = "INSERT INTO notifications_table (id_user, id_actor, id_postagem, type) VALUES ($1, $2, $3, $4) returning id_user"
    return await pool.query(query, values)
  }
  async selectNotifications(id_user: number) {
    const values = [id_user]
    const query = `
            SELECT
          COUNT(*) AS notifications
            FROM
          notifications_table n
          JOIN users_table d ON d.id_user = n.id_user
          JOIN users_table a ON a.id_user = n.id_actor
          JOIN postagens_table p ON p.id_postagem = n.id_postagem
            WHERE
          d.id_user = $1
          AND a.id_user != d.id_user
          AND n.read = false`;
    return await pool.query(query, values)
  }
}