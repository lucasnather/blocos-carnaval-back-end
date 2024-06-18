import { prisma } from "../database/prisma.js"

type ProfileType = {
    id: string
    displayName: string
}

type ProfileTypeId = Pick<ProfileType, 'id'>

export async function createGoogleUser(profile: ProfileType) {

    const user = await prisma.users.create({
        data: {
            googleId: profile.id,
            googleName: profile.displayName
        }
    })

    return user
}

export async function findGoogleUser(profile: ProfileTypeId) {
    const findUser = await prisma.users.findFirst({
        where: {
            googleId: profile.id
        }
    })

    return findUser
}
