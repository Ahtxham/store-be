import express, { Application } from "express";
import path from "path";

// import GeneralHelper from '#Services/GeneralHelper';
// import errorHandler from "./middlewares/errorHandler";
import { routes } from "./routes";
import helmet from "helmet";

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
// app.use(errorHandler.notFound);
// app.use(errorHandler.internalServerError);

export default app;
