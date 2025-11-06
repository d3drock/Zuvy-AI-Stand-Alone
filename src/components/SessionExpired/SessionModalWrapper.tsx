// components/SessionModalWrapper.tsx
'use client'

import { useSessionModalStore } from '@/store/session.store'
import { SessionExpiredModal } from '@/components/SessionExpired/SessionExpiredModal'

export default function SessionModalWrapper() {
    const showModal = useSessionModalStore((state) => state.showModal)
    return showModal ? <SessionExpiredModal /> : null
}
