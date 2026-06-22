import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Importamos tus rutas desde el archivo que acabas de renombrar
import { loadBackendFMM, loadBackendFMM_v2, loadIntegrationsProxy } from './api-fmm.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Cargamos tus rutas pasándole la app de Express
loadBackendFMM(app);
loadBackendFMM_v2(app);
loadIntegrationsProxy(app);

// Le dice al servidor que se quede encendido (vital para los tests)
app.listen(port, () => {
    console.log(`🚀 Servidor API funcionando y escuchando en el puerto ${port}`);
});