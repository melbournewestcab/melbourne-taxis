import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import visitorsRouter from "./visitors";
import routesRouter from "./routes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/bookings", bookingsRouter);
router.use("/visitors", visitorsRouter);
router.use("/routes", routesRouter);

export default router;
