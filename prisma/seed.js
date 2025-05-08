import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const DATA = [
    {
        "mode": "MENGANGGUR",
        "schedules": [
            { "start": "07:00", "end": "07:30", "task": "Bangun, stretching ringan, sarapan" },
            { "start": "07:30", "end": "09:00", "task": "Belajar Bahasa Jepang (fokus JLPT, grammar + kanji)" },
            { "start": "09:00", "end": "09:15", "task": "Istirahat" },
            { "start": "09:15", "end": "11:00", "task": "Belajar AI / programming (kursus, coding project, nonton tutorial)" },
            { "start": "11:00", "end": "12:00", "task": "Freelance ringan / personal project" },
            { "start": "12:00", "end": "13:00", "task": "Makan siang, istirahat" },
            { "start": "13:00", "end": "14:30", "task": "Coding project (AI mini project / backend / portfolio dev)" },
            { "start": "14:30", "end": "15:00", "task": "Istirahat, minum teh/kopi, jalan santai" },
            { "start": "15:00", "end": "17:00", "task": "Latihan bahasa Inggris (TOEFL/IELTS prep, listening + reading)" },
            { "start": "17:00", "end": "18:00", "task": "Rekreasi: game, Youtube, baca non-akademik" },
            { "start": "18:00", "end": "19:00", "task": "Makan malam, ibadah, santai" },
            { "start": "19:00", "end": "20:00", "task": "Review coding / GitHub update / belajar tech lainnya" },
            { "start": "20:00", "end": "21:00", "task": "Netflix / hiburan ringan / ngobrol dengan teman" },
            { "start": "21:00", "end": "22:00", "task": "Latihan soal JLPT / nulis catatan Jepang" },
            { "start": "22:00", "end": "23:00", "task": "Santai, journaling, persiapan tidur" },
            { "start": "23:00", "end": "00:00", "task": "Baca ringan / podcast / tidur awal opsional" },
            { "start": "00:00", "end": "02:00", "task": "(Opsional) Coding malam / deep work / waktu kreatif jika mood" }
        ]
    },
    {
        "mode": "FREELANCE",
        "schedules": [
            { "start": "07:00", "end": "07:30", "task": "Bangun, stretching ringan, sarapan" },
            { "start": "07:30", "end": "09:00", "task": "Job freelance (jika ada deadline) atau belajar Jepang" },
            { "start": "09:00", "end": "09:15", "task": "Istirahat" },
            { "start": "09:15", "end": "11:00", "task": "Freelance task (coding, revisi, client meeting)" },
            { "start": "11:00", "end": "12:00", "task": "Belajar AI / project pribadi (jika freelance ringan)" },
            { "start": "12:00", "end": "13:00", "task": "Makan siang, istirahat" },
            { "start": "13:00", "end": "15:00", "task": "Freelance task (coding / testing)" },
            { "start": "15:00", "end": "16:00", "task": "Latihan Bahasa Inggris (listening / reading)" },
            { "start": "16:00", "end": "17:00", "task": "Project AI (jika ada waktu) atau istirahat santai" },
            { "start": "17:00", "end": "18:00", "task": "Rekreasi, ringan, ibadah" },
            { "start": "18:00", "end": "19:00", "task": "Makan malam" },
            { "start": "19:00", "end": "20:00", "task": "Freelance tambahan (jika urgent) atau belajar Jepang ringan" },
            { "start": "20:00", "end": "21:00", "task": "Hiburan / ngobrol / santai" },
            { "start": "21:00", "end": "22:00", "task": "Update GitHub / portofolio / baca artikel tech" },
            { "start": "22:00", "end": "23:00", "task": "Santai, journaling" },
            { "start": "23:00", "end": "00:00", "task": "Tidur awal opsional" },
            { "start": "00:00", "end": "02:00", "task": "(Opsional) kerja tambahan jika urgent / deep work coding" }
        ]
    },
    {
        "mode": "BEKERJA",
        "schedules": [
            { "start": "07:00", "end": "07:30", "task": "Bangun, stretching ringan, sarapan" },
            { "start": "07:30", "end": "08:00", "task": "Persiapan kerja" },
            { "start": "08:00", "end": "17:00", "task": "Bekerja kantor (include commute + lunch)" },
            { "start": "17:00", "end": "18:00", "task": "Istirahat, ibadah, santai" },
            { "start": "18:00", "end": "19:00", "task": "Makan malam" },
            { "start": "19:00", "end": "20:30", "task": "Belajar Bahasa Jepang (grammar, kanji, listening)" },
            { "start": "20:30", "end": "21:00", "task": "Istirahat ringan (game, youtube, dll)" },
            { "start": "21:00", "end": "22:00", "task": "Latihan bahasa Inggris / review coding ringan" },
            { "start": "22:00", "end": "23:00", "task": "Project pribadi (AI / coding project portofolio)" },
            { "start": "23:00", "end": "00:00", "task": "Journaling / santai / persiapan tidur" },
            { "start": "00:00", "end": "02:00", "task": "(Opsional) Deep work coding malam / belajar lanjutan" }
        ]
    }
]


async function main() {
    const check = await db.schedule.count();
    if (check > 0) {
        console.log('Database already seeded. Exiting...');
        return;
    } else {

        for (const data of DATA) {
            const createdMode = await db.mode.create({
                data: {
                    name: data.mode,
                    schedules: {
                        createMany: {
                            data: data.schedules.map(schedule => ({
                                start: schedule.start,
                                end: schedule.end,
                                task: schedule.task,
                            }))
                        }
                    },
                },
                include: {
                    schedules: true,
                }
            })
            console.log(`Seeded mode: ${createdMode.name}`);
            console.log('Schedules:', createdMode.schedules);
        }
        console.log('Database seeded successfully!');
    }
}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })