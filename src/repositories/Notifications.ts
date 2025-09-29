import pool from "../db/connect";

export default class NotificationsRepository {
    async selectNotifications(id_user: number) {
        const values = [id_user]
        const query = `select
  count(*) as notifications
from
  notifications_table n
  join users_table d on d.id_user = n.id_user
  join users_table a on a.id_user = n.id_actor
  join postagens_table p on p.id_postagem = n.id_postagem
where
  d.id_user = $1
  and a.id_user != d.id_user
  and n.read = false`
        return await pool.query(query, values)
    }
}