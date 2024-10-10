'use server'

import { isRedirectError } from 'next/dist/client/components/redirect'

import { auth, signIn, signOut } from '@/auth'
import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from '../validator'
import { hashSync } from 'bcrypt-ts-edge'
import prisma from '@/lib/prismadb'
import { formatError } from '../utils'
import { ShippingAddress } from '@/types'
import { revalidatePath } from 'next/cache'

// CREATE
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const userSchema = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    })
    const values = {
      name: userSchema.name,
      email: userSchema.email,
      password: hashSync(userSchema.password, 10),
    }
    
    
    await prisma.user.create({
      data: values
    })

    await signIn('credentials', {
      email: userSchema.email,
      password: userSchema.password,
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return {
      success: false,
      message: formatError (error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? 'Email is already exist'
        : formatError(error),
    }
  }
}

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    await signIn('credentials', user)
    return { success: true, message: 'Signed in successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export const SignOut = async () => {
  await signOut()
}

// Get user by id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    } 
  })

  if (!user) throw new Error('User not found')
  return user
}

// UPDATE SHIPPING ADDRESS
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth()
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user.id
      }
    })

    if (!currentUser) throw new Error('User not found')

    const address = shippingAddressSchema.parse(data)
    await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: { address }
    })
      
    revalidatePath('/place-order')
    
    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}