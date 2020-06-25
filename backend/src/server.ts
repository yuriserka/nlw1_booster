import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { PORT, HOST } from './common/config';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
