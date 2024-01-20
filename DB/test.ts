import { User, PrismaClient, Log, Door, User_Door } from '@prisma/client'
import e from 'express'
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

export async function deleteDoor(id:number):Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.door.delete({
                where: {
                    id
                }
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function deleteUser(id:number):Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.user.delete({
                where: {
                    id
                }
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function editUser(data: any): Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.user.update({
                where: {id: data.id},
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
            for (const d of data.User_Door) {
                object.push({
                    did: d.did
                })
            }
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    username: data.username,
                    password: data.password,
                    User_Door: {
                        createMany: {
                            data: object
                        }
                    }
                }
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function toggleDoor(doorId: number, closed: boolean, user:User) {
    if (!user.isadmin) {
        // If user is not admin -> checking that he has the right to toggle this door
        const door = await prisma.door.findFirst({
            where: {
                id: doorId,
                AND: {
                    User_Door: {
                        some: {
                            uid: user.id
                        }
                    }
                }
            }
        })
        if(!door) {
            return false
        }
    }
    await prisma.door.update({
        where: {
            id: doorId
        },
        data: {
            closed
        }
    })
    return true
}

export async function editDoor(data: any): Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.door.update({
                where: {
                    id: data.id
                },
                include: {
                    User_Door: true
                },
                data: {
                    User_Door: {
                        deleteMany: {}
                    }
                }
            });
            const object:any[] = []
            for (const d of data.User_Door) {
                object.push({
                    uid: d.uid
                })
            }
            await prisma.door.update({
                where: {
                    id: data.id
                },
                include: {
                    User_Door: true
                },
                data: {
                    closed: data.closed,
                    name: data.name,
                    User_Door: {
                        createMany: {
                            data: object
                        }
                    }
                }
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function createUser(userData: User): Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.user.create({
                data: userData
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function createDoor(doorData: Door): Promise<true|Error> {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.door.create({
                data: doorData
            })
            resolve(true)
        } catch (E) {
            reject(E)
        }
    })
}

export async function getDoorDetail(user: User, doorId: number): Promise<Door|false> {
    let res:any
    if(user.isadmin) {
        res = await prisma.door.findFirst({
            include: {
                User_Door: {
                    include: {
                        user: true
                    }
                }
            },
            where: {
                id: {
                    equals: doorId
                }
            }
        })
    } else {
        res = await prisma.door.findFirst({
            include: {
                User_Door: {
                    include: {
                        user: true
                    }
                }
            },
            where: {
                User_Door: {
                    some: {
                        uid: {
                            equals: user.id
                        }
                    }
                },
                AND: {
                    id: {
                        equals: doorId
                    }
                }
            }
        })
    }
    return new Promise((resolve) => {
        if (res) {
            resolve(res)
        } else {
            resolve(false)
        }
    })
}

export async function getUsers(): Promise<User[]> {
    return prisma.user.findMany()
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
    if  (user.isadmin) {
        return getDoors()
    } else {
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