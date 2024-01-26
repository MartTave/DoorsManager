import { Door, PrismaClient, User } from '@prisma/client'
import { getDoors, getDoorsForUser } from "../DB/DBInteraction"

const prisma = new PrismaClient()

// Admin user creation if not exist
async function adminCreation() {
    const res = await prisma.user.findFirst()
    if (!res) {
        const admin = await prisma.user.create({
            data: {
                username: "admin",
                // This password is the sha512 hash for "admin"
                password: "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec",
                isadmin: true
            }
        })
        return admin
    }
    return res
}
async function createDoors() {
    const door1 = await prisma.door.create({
        data: {
            name: "test",
            closed: true
        }
    })
    const door2 = await prisma.door.create({
        data: {
            name: "test1",
            closed: true
        }
    })
    return [door1, door2]
}

async function adminSeeDoors(admin: User, doors: Door[], expected:boolean) {
    let test1 = await getDoorsForUser(admin)
    if (expected) {
        if(!test1 || test1.includes(doors[0]) || test1.includes(doors[1])) {
            console.log("[ERROR] User couldn't see doors")
        }
    } else {
        if(test1 && test1.includes(doors[0]) && test1.includes(doors[1])) {
            console.log("[ERROR] User should see doors")
        }
    }
}

async function tests() {
    const admin = await adminCreation()
    const res = await createDoors()
    await adminSeeDoors(admin, res, true)
    prisma.user.update({
        where: {
            id: admin.id
        },
        data: {
            isadmin: false
        }
    })
    await adminSeeDoors(admin, res, false)
    prisma.user.update({
        where: {
            id: admin.id
        },
        include: {
            User_Door: true
        },
        data: {
            User_Door: {
                createMany: {
                    data: [
                        {
                            did: res[0].id
                        },
                        {
                            did: res[1].id
                        }
                    ]
                }
            }
        }
    })
    await adminSeeDoors(admin, res, true)
    await clearTests(admin, res)
}

async function clearTests(admin: User, doors: Door[]) {
    // TODO: uncomment this part if you want to remove the admin user after the tests
    // await prisma.user.delete({
    //     where: {
    //         id: admin.id
    //     }
    // })
    await prisma.door.delete({
        where: {
            id: doors[0].id
        }
    })
    await prisma.door.delete({
        where: {
            id: doors[1].id
        }
    })
}


tests()
console.log("[SUCCESS] Tests done !")