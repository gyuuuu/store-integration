import express, { Request, Response, NextFunction } from 'express';
import router from './router';
import { envConfig } from './common/config/env.config';

envConfig(process.env.NODE_ENV as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

// 에러 처리기. 미들웨어의 가장 마지막에 있어야한다.
app.use((error: Error, eq: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: error.message });
});

app.listen(process.env.PORT, () => {
  console.log('start');
});
