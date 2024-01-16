import { User, PrismaClient, Log, Door, User_Door } from '@prisma/client'
import { get } from 'https'
const prisma = new PrismaClient()


export async function getDoors(): Promise<Door[]|false> {
	try{
	    let doors:Door[]
        doors = await prisma.door.findMany()
        return doors
    } catch (e) {
        return false
    }
}

type Test = {
    user: User,
    hasAccess: boolean
}

export async function getUsersForDoor(doorToCheck: Door): Promise<Test[]|false> {
    try{
        let usersReturn: Test[] = []
	    let usersWithAccess:User[]
        let usersWithoutAccess:User[]
        usersWithAccess = await prisma.user.findMany({
            include:{
                User_Door: true
            },
            where:{
                User_Door:{
                    some:{
                       did:{
                        equals: doorToCheck.id
                       }
                    }
                }
            }
        })
        usersWithoutAccess = await prisma.user.findMany({
            include:{
                User_Door: true
            },
            where:{
                User_Door:{
                    every:{
                       did:{
                            not:{
                                equals: doorToCheck.id
                            }
                        }
                    }
                }
            }
        })
        for(let val of usersWithAccess){
            let thisUser: Test = {
                user: val,
                hasAccess: true
            }
            usersReturn.push(thisUser)
        }
        for(let val of usersWithoutAccess){
            let thisUser: Test = {
                user: val,
                hasAccess: false
            }
            usersReturn.push(thisUser)
        }
        return usersReturn;
    } catch (e) {
        return false
    }
}

export async function checkUser(un: string, pw: string): Promise<User|false> {
    let matchingUser: User[]
    matchingUser = await prisma.user.findMany({
        where:{
            username:{
                equals: un
            },
            AND:{
                password:{
                    equals: pw
                }
            }
        }
    })
    if(matchingUser.length == 0) return false
    return matchingUser[0]
}

export async function getDoorsForUser(user:User): Promise<Door[]|false> {
    let doorsForUser: Door[]
    doorsForUser = await prisma.door.findMany({
        where:{
            User_Door:{
                some:{
                    uid:{
                        equals: user.id
                    }
                }
            }
        }
    })
    if(doorsForUser.length == 0) return false
    return doorsForUser
}

async function main() {
    let theDoors = await getDoors()
    if(theDoors === false) {
        console.log("Something went wrong...")
    } else {
        const doors = await getUsersForDoor(theDoors[0])
        //console.log(doors)
    }

    console.log(await getDoorsForUser({id: 1, username: "hihihi", password: "yo", isadmin: false}))
	
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