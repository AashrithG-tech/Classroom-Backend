import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const ARCJET_KEY = process.env.ARCJET_KEY;

if (!ARCJET_KEY && process.env.NODE_ENV !== "test") {
    throw new Error("ARCJET_KEY is not set in .env file");
}

const aj = arcjet({
    key: ARCJET_KEY as string, // 👈 THIS LINE FIXES THE BUILD
    rules: [
        shield({ mode: "LIVE" }),

        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
            ],
        }),

        slidingWindow({
            mode: "LIVE",
            interval: "2s",
            max: 5,
        }),
    ],
});

export default aj;
