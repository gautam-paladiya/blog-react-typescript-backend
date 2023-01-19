import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {postRouter} from "./post/post.router";
import { logger } from './config/logger';

dotenv.config();
let server
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/post", postRouter);
app.use("/storage", express.static("uploads"));

server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
      logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
