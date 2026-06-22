import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import { loadBackendFMM, loadBackendFMM_v2, loadIntegrationsProxy } from './api-fmm.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Servir los archivos estáticos del frontend de Svelte (generados en la carpeta dist por Vite)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'src', 'front', 'dist'))); 

loadBackendFMM(app);
loadBackendFMM_v2(app);
loadIntegrationsProxy(app);

app.listen(port, () => {
    console.log(`🚀 Servidor API funcionando y escuchando en el puerto ${port}`);
});