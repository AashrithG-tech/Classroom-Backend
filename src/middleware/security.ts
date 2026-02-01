import aj from "../config/arcjet";
import { NextFunction, Request, Response } from "express";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

type RateLimitRole = "admin" | "teacher" | "student" | "guest";

const securityMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (process.env.NODE_ENV === "test") return next();

    try {
        const role: RateLimitRole =
            (req as any).user?.role ?? "guest";

        let limit: number;
        let message: string;

        switch (role) {
            case "admin":
                limit = 20;
                message = "Too many requests for admin. Slow down";
                break;
            case "teacher":
            case "student":
                limit = 10;
                message = "Too many requests (10 per minute). Slow down";
                break;
            default:
                limit = 5;
                message =
                    "Too many requests (5 per minute). Slow down. Sign up to get more requests";
                break;
        }

        const client = aj.withRule(
            slidingWindow({
                mode: "LIVE",
                interval: "1m",
                max: limit,
            })
        );

        const arcjetRequest: ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: {
                remoteAddress:
                    req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
            },
        };

        const decision = await client.protect(arcjetRequest);

        if (decision.isDenied() && decision.reason.isBot()) {
            return res
                .status(403)
                .json({ error: "Bot detected, automated requests are not allowed" });
        }

        if (decision.isDenied() && decision.reason.isShield()) {
            return res
                .status(429)
                .json({ error: "Request denied due to privacy policies" });
        }

        if (decision.isDenied() && decision.reason.isRateLimit()) {
            return res
                .status(403)
                .json({ error: "Too many requests" });
        }

        next();
    } catch (e: any) {
        console.error(e);
        res
            .status(500)
            .json({ error: e?.message || "Internal Server Error" });
    }
};

export default securityMiddleware;
