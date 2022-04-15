import express, {json} from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import router from './routers/index.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(json());
app.use(router);

app.listen(process.env.PORT || 5000, () => {
    console.log(`runnig in port ${process.env.PORT || 5000}`)
})
