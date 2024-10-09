"use server"

import { auth } from "@/auth"
import { cookies } from "next/headers"
import prisma from "@/lib/prismadb"
import { cartItemSchema } from "../validator"
import { formatError, round2 } from "../utils"
import { CartItem } from "@/types"
import { revalidatePath } from "next/cache"

export async function getMyCart() {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) return undefined
    
    const session = await auth()
    const userId = session?.user.id
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          userId ? { userId: userId } : { sessionCartId: sessionCartId },
        ],
      },
    });
    
    return cart
  }
  
  // CREATE
  
  const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + item.price * item.qty, 0)
      ),
      shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
      taxPrice = round2(0.15 * itemsPrice),
      totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    }
  }
  
  export const addItemToCart = async (
    data: CartItem
  ) => {
    
    try {
      const sessionCartId = cookies().get('sessionCartId')?.value
      
      
      if (!sessionCartId) throw new Error('Cart Session not found')
        const session = await auth()
      const userId = session?.user.id as string | undefined
      const cart = await getMyCart()
      const item = cartItemSchema.parse(data)
      console.log({item});
      
      const product = await prisma.product.findFirst({
        where: {
          id: item.productId
        }
      })
      
      if (!product) throw new Error('Product not found')
      if (!cart) {
        if (product.stock < 1) throw new Error('Not enough stock')
        await prisma.cart.create({
            data: {
                userId,
                items: [item],
                sessionCartId,
                ...calcPrice([item])
            }
        })
        revalidatePath(`/product/${product.slug}`)
        return {
          success: true,
          message: 'Item added to cart successfully',
        }
      } else {
        const existItem = cart.items.find(
          (x: CartItem) => x.productId === item.productId
        )
        if (existItem) {
          if (product.stock < existItem.qty + 1)
            throw new Error('Not enough stock')
          cart.items.find((x: CartItem) => x.productId === item.productId)!.qty =
            existItem.qty + 1
        } else {
          if (product.stock < 1) throw new Error('Not enough stock')
          cart.items.push(item)
        }
        await prisma.cart
          .update({
            where: {
                id: cart.id
            },
            data: {
                items: cart.items,
                ...calcPrice(cart.items) 
            }
          })
  
        revalidatePath(`/product/${product.slug}`)
        return {
          success: true,
          message: `${product.name} ${
            existItem ? 'updated in' : 'added to'
          } cart successfully`,
        }
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
  }

  export const removeItemFromCart = async (productId: string) => {
    return { success: true, message: `${productId} removed`}
  }
  
//   export const removeItemFromCart = async (productId: string) => {
//     try {
//       const sessionCartId = cookies().get('sessionCartId')?.value
//       if (!sessionCartId) throw new Error('Cart Session not found')
  
//       const product = await db.query.products.findFirst({
//         where: eq(products.id, productId),
//       })
//       if (!product) throw new Error('Product not found')
  
//       const cart = await getMyCart()
//       if (!cart) throw new Error('Cart not found')
  
//       const exist = cart.items.find((x) => x.productId === productId)
//       if (!exist) throw new Error('Item not found')
  
//       if (exist.qty === 1) {
//         cart.items = cart.items.filter((x) => x.productId !== exist.productId)
//       } else {
//         cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1
//       }
//       await db
//         .update(carts)
//         .set({
//           items: cart.items,
//           ...calcPrice(cart.items),
//         })
//         .where(eq(carts.id, cart.id))
//       revalidatePath(`/product/${product.slug}`)
//       return {
//         success: true,
//         message: `${product.name}  ${
//           cart.items.find((x) => x.productId === productId)
//             ? 'updated in'
//             : 'removed from'
//         } cart successfully`,
//       }
//     } catch (error) {
//       return { success: false, message: formatError(error) }
//     }
//   }