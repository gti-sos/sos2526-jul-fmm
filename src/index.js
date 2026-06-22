import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'; // 1. Añade esto arriba del todo

import { loadBackendFMM, loadBackendFMM_v2, loadIntegrationsProxy } from './api-fmm.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// 2. Añade esta línea para que Express sirva los archivos de Svelte
// (Dependiendo de cómo instales Svelte, la carpeta será 'public', 'dist' o 'build')
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'src', 'front', 'public'))); 

loadBackendFMM(app);
loadBackendFMM_v2(app);
loadIntegrationsProxy(app);

app.listen(port, () => {
    console.log(`🚀 Servidor API funcionando y escuchando en el puerto ${port}`);
});