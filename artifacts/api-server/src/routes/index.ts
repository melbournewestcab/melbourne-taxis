import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import visitorsRouter from "./visitors";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/bookings", bookingsRouter);
router.use("/visitors", visitorsRouter);

export default router;
