import { db } from "../../lib/db.js";

export const getSchedule = async () => {
    try {
        const switchData = await db.switch.findFirst({
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!switchData) {
            throw new Error("No switch data found");
        }
        const mode = await db.mode.findFirst({
            where: {
                id: switchData.modeId
            },
            include: {
                schedules: {
                    orderBy: {
                        start: "asc"
                    }
                }
            }
        })
        if (!mode) {
            throw new Error("No mode data found");
        }
        return mode;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        throw error;
    }
}

export const switchMode = async (name) => {
    try {
        const mode = await db.mode.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive"
                }
            }
        })
        if (!mode) {
            throw new Error("No mode data found");
        }
        const switchData = await db.switch.create({
            data: {
                modeId: mode.id
            }
        })
        return switchData;
    } catch (error) {
        console.error("Error switching mode:", error);
        throw error;
    }
}
