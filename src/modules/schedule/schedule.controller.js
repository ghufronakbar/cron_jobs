import express from "express";
import cron from "node-cron"
import { sendWhatsapp } from "../../lib/whatsapp.js";
import { getSchedule } from "./schedule.service.js"
import { convertHour } from "../../helper/convert-hour.js";

const router = express.Router();
const jobs = [];

export const scheduleTask = async () => {
    try {
        const schedule = await getSchedule()
        if (!schedule) {
            console.log("No schedule found");
            return;
        }
        console.log('Schedules:', schedule.id, schedule.name);
        const now = new Date();
        const nowHour = `0${now.getHours()}`.slice(-2);
        const nowMinute = `0${now.getMinutes()}`.slice(-2);
        const nowCronExpression = `${nowMinute} ${nowHour} * * *`;

        console.log(`Current Time: ${convertHour(nowCronExpression)}`);

        jobs.forEach(job => {
            console.log(`Stopping job: ${job}`);
            job.stop();
        })

        schedule.schedules.forEach(schedule => {
            // Ambil waktu mulai (start) dan ubah ke format cron yang sesuai
            const [startHour, startMinute] = schedule.start.split(':');
            const cronExpression = `${startMinute} ${convertHour(startHour)} * * *`;
            console.log(`[${cronExpression}] : ${schedule.task}`);


            // Buat cron job berdasarkan cronExpression
            const job = cron.schedule(cronExpression, async () => {
                console.log(`[${cronExpression}] : Sending Message: ${schedule.task}`);
                const message = `*REMINDER*\n\n[${schedule.start}]\n${schedule.task}`
                await sendWhatsapp(message);
            });

            // Tambahkan job ke array jobs
            jobs.push(job);
        });
    } catch (error) {
        console.error("Error in schedule task:", error);
    }
}

router.post("/", async (req, res) => {
    try {
        console.log("Received schedule request");
        console.log(req.body);
        return res.status(200).json({ status: 200, message: "Success" });
    } catch (error) {
        console.error("Error in schedule task:", error);
        await sendWhatsapp(`Error in schedule task: ${error}`);
    }
})

router.get("/", async (req, res) => {
    await scheduleTask();
    return res.status(200).json({ status: 200, message: "Success refreshing schedule" });
})

export default router