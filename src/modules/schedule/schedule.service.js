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
        await db.switch.create({
            data: {
                modeId: mode.id
            }
        })

        return mode;
    } catch (error) {
        console.error("Error switching mode:", error);
        throw error;
    }
}

export const getAllModes = async () => {
    try {
        const modes = await db.mode.findMany();
        return modes;
    } catch (error) {
        console.error("Error fetching modes:", error);
        throw error;
    }
}