import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handler } from './src/front/build/handler.js';
import { loadBackendFMM, loadBackendFMM_v2, loadIntegrationsProxy } from './api-fmm.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

loadBackendFMM(app);
loadBackendFMM_v2(app);
loadIntegrationsProxy(app);

app.use(handler);

app.listen(port, () => {
    console.log(`🚀 Servidor API funcionando y escuchando en el puerto ${port}`);
});