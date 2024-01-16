import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function createAdmin () {
    await prisma.user.create({
        data: {
            username: "admin",
            isadmin: true,
            password: "admin"
        }
    })
}
createAdmin()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})