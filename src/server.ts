import dotenv from "dotenv"
import { httpServer } from "./IoServer/index"

dotenv.config();

const port = process.env.PORT

httpServer.listen(port, () => {
    console.log(`🔗 Servidor ioSocket iniciado na porta ${port}`);
});