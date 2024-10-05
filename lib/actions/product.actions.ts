"use server";

import prisma from "@/lib/prismadb";

export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        orderBy: [
            { createdAt: 'desc'}
        ],
        take: 4
    })

    return data;
}