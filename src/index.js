import express from "express";
import dotnev from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error_middleware.js";
import userRouter from "./route/user.route.js"
import projectController from "./route/project.route.js"
import taskRouter from "./route/task.route.js"
import setupSwaggerDocs from "./lib/swagger.js";
import cors from "cors"
import FileUpload from "express-fileupload";


dotnev.config();

export const app = express();

app.use(cors())
app.use(express.json());
app.use(FileUpload());

app.use(express.static("./public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/users', userRouter);
app.use('/api/projects', projectController);
app.use('/api/tasks', taskRouter);


app.use(errorMiddleware);

setupSwaggerDocs(app)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})