import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient()

export const testDb = async () => {
    try {
        const schedules = await db.schedule.count()
        console.log(`DB TESTED - SCHEDULES: ${schedules}`)
    } catch (error) {
        console.log(error)        
    }
}