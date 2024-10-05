import data from "@/lib/data";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prismadb"

// const prisma = new PrismaClient();

async function main() {
    // const products = await prisma.product.createMany({
    //     data: data.products
    // })
      
    const users = await prisma.user.createMany({
      data: data.users
    })
        
    

    console.log(users);
    
  }
  
  main()
    .catch(e => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });

    // npx tsx ./db/seed