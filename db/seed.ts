import data from "@/lib/data";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prismadb"

// const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.createMany({
        data: data.products
    })
        
        
    

    console.log(products);
    
  }
  
  main()
    .catch(e => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });