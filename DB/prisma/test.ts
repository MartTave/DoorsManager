import { User, PrismaClient, Log, Door, User_Door } from '@prisma/client'
const prisma = new PrismaClient()

// Existing mail : browncarrie@example.net

async function getDoors(): Promise<Door[]|false> {
	
	let doors:Door[];
    doors = await prisma.door.findMany()
    return doors;
	
}

async function main() {
	const doors = await getDoors()
    console.log(doors)
}


main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})