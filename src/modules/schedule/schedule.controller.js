import express from "express";
import cron from "node-cron";
import { sendWhatsapp } from "../../lib/whatsapp.js";
import { getSchedule, switchMode } from "./schedule.service.js";
import { convertHour } from "../../helper/convert-hour.js";

const router = express.Router();

// Menjadwalkan cron job di tingkat global
let scheduledJobs = [];

export const scheduleTask = async () => {
    try {
        // Ambil schedule terbaru
        const schedule = await getSchedule();
        if (!schedule) {
            console.log("No schedule found");
            return;
        }

        console.log('Schedules:', schedule.id, schedule.name);
        const now = new Date();
        const nowHour = `0${now.getHours()}`.slice(-2);
        const nowMinute = `0${now.getMinutes()}`.slice(-2);
        const nowCronExpression = `${nowMinute} ${convertHour(nowHour)} * * *`;

        console.log(`Current Time: ${nowCronExpression}`);

        // Hentikan cron job sebelumnya
        scheduledJobs.forEach(job => job.stop());

        // Jadwalkan cron job berdasarkan schedule yang ada
        schedule.schedules.forEach(schedule => {
            const [startHour, startMinute] = schedule.start.split(':');
            const cronExpression = `${startMinute} ${convertHour(startHour)} * * *`;
            console.log(`[${cronExpression}] : ${schedule.task}`);

            const job = cron.schedule(cronExpression, async () => {
                console.log(`[${cronExpression}] : Sending Message: ${schedule.task}`);
                const message = `*REMINDER*\n\n[${schedule.start}]\n${schedule.task}`;
                await sendWhatsapp(message);
            });

            // Simpan cron job yang dijadwalkan
            scheduledJobs.push(job);
        });
    } catch (error) {
        console.error("Error in schedule task:", error);
    }
};

// Middleware untuk webhook
router.post("/webhook", async (req, res) => {
    try {
        console.log("Received webhook request");
        console.log(req.body);
        const { message, sender } = req.body;
        if (sender === "6285156031385" || sender === "085156031385") {
            if (message) {
                if (message.includes("REFRESH")) {
                    await scheduleTask();
                    await sendWhatsapp("Refreshed schedule");
                } else if (message.includes("MODE:")) {
                    const mode = message.split(":")[1].trim();
                    try {
                        await switchMode(mode);
                        await scheduleTask();
                        await sendWhatsapp(`Refreshed schedule to ${mode}`);
                    } catch (error) {
                        console.error("Error while setting mode:", error);
                        await sendWhatsapp(`Error while setting mode: ${error?.message || error}`);
                    }
                } else {
                    console.log("INVALID COMMAND");
                    // await sendWhatsapp("Invalid command");
                }
            }
        }
        return res.status(200).json({
            status: 200, message: "Success", req: {
                body: req.body,
                query: req.query,
                params: req.params,
                headers: req.headers
            }
        });
    } catch (error) {
        console.error("Error in schedule task:", error);
        await sendWhatsapp(`Error in schedule task: ${error}`);
    }
});

router.get("/webhook", async (req, res) => {
    try {
        return res.status(200).json({ status: 200, message: "Success testing webhook", req });
    } catch (error) {
        console.error("Error in schedule task:", error);
        return res.status(500).json({ status: 500, message: "Success refreshing schedule" });
    }
})

router.get("/", async (req, res) => {
    await scheduleTask();
    return res.status(200).json({ status: 200, message: "Success refreshing schedule" });
});


export default router;
