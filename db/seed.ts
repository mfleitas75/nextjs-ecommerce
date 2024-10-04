import data from "@/lib/data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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