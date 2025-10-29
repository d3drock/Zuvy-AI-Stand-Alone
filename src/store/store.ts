'use client'

import { create } from 'zustand'
import { useEffect } from 'react'
import { api } from '@/utils/axios.config'
import { string } from 'zod'
import { OFFSET, POSITION } from '@/utils/constant'
import { persist } from 'zustand/middleware'
import axios from 'axios'



// ------------------------- Session expire ---------------------------

type SessionStore = {
    showModal: boolean
    setShowModal: (value: boolean) => void
}

export const useSessionModalStore = create<SessionStore>((set) => ({
    showModal: false,
    setShowModal: (value) => set({ showModal: value }),
}))

// ------------------------- User ------------------------
