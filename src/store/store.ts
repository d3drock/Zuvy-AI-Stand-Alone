import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface User {
    rolesList: any[]
    id: string
    email: string
    name: string
    profile_picture?: string
    [key: string]: any // Allow additional properties if the structure varies
}

type UserState = {
    user: User
    setUser: (newValue: User) => void
}

export const getUser = create<UserState>()(
    persist(
        (set) => ({
            user: {
                rolesList: [],
                id: '',
                email: '',
                name: '',
            },
            setUser: (newValue: User) => {
                set({ user: newValue })
            },
        }),
        {
            name: 'user-storage', // Key for localStorage or other storage
            // Optional: Customize storage, serialize/deserialize logic, etc.
            partialize: (state) => ({ user: state.user }), // Save only the user property
        }
    )
)