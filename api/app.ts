import express from "express";
import bodyparser from "body-parser";
import logger from "morgan";
import courseRouter from "./routes/courses";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";

(async () => {
  try {
    // Initialize express
    const app = express();
    const port = Number(process.env.PORT) || 8080;
    app.set("port", port);

    // Middleware
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());

    if (process.env.NODE_ENV !== "production") {
      app.use(logger("dev"));
      app.use(function (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
        res.header("Access-Control-Allow-Origin", `http://localhost:3000`);
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      });
    }

    app.use("/courses", courseRouter);
    app.use("/posts", postsRouter);
    app.use("/comments", commentsRouter);

    // Routes
    app.get("/", (req: express.Request, res: express.Response) => {
      return res.send(`Hello YACMA!`);
    });

    app.get("/api", (req: express.Request, res: express.Response) => {
      return res.json(`YACMA. It's on the syllabus.`);
    });

    // Launch Server
    app.listen(port, () => {
      console.log(`📡 Server up! 📡 Listening on  http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
