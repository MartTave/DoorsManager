import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function createAdmin () {
    const door = await prisma.door.findFirst({
		where: {
			id: 1
		},
		include: {
			User_Door: true
		}
	})
	if (door) {
		door.User_Door.pop()
		const disconnectPreviouslyConnectedFeatures =  await prisma.door.update({
			where: {id: 1},
			include: {
				User_Door: true
			},
			data: {
				User_Door: {
					deleteMany: {
						
					}
				}
			}
		})
		const object:any[] = []
		for (const d of door.User_Door) {
			object.push({
				uid: d.uid
			})
		}
		const res = await prisma.door.update({
			where: {
				id: 1
			},
			include: {
				User_Door: true
			},
			data: {
				name: door.name,
				closed: door.closed,
				User_Door: {
					createMany: {
						data: object
					}
				}
			}
		})
	}
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