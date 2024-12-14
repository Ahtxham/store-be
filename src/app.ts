import express, { Application } from "express";
import path from "path";
import helmet from "helmet";

// import GeneralHelper from '#Services/GeneralHelper';
import errorMiddleware from "@middlewares/errorMiddleware";
import { routes } from "./routes";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/Assets", express.static(path.join(__dirname, "Assets")));

// Routes
app.use("/", routes);

// Error Handling
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.internalServerError);

export default app;
