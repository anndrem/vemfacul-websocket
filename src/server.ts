import { httpServer } from "./IoServer/index"

const port = process.env.PORT

httpServer.listen(port, () => {
    console.log(`🔗 ioSocket running on port ${port}`);
}); 