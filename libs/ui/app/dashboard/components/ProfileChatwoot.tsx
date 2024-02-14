import { toast } from '@/components/ui/use-toast'
import { Profile } from '@/types/profile'
import { ProfileChatwoot as TypeProfile } from '@/types/profileChatwoot'
import React, { useState } from 'react'

interface Props {
  profile?: TypeProfile
}

export const ProfileChatwoot = ({profile}: Props) => {

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        color: "green",
        description: "Copied Succesfuly",
      })
    } catch (err) {
      toast({
        color: "red",
        description: "Failed copy",
      })
    }
  }

  return (
    <div className='w-full p-3'>
      <div className='flex flex-col gap-3'>
        <p className='rounded-sm bg-white p-2 text-sm text-black'><span className='mr-2 text-sm font-semibold text-gray-600'>User Name:</span> {profile?.available_name}</p>
        <div className='relative flex items-center rounded-sm bg-white p-2 text-sm text-black'>
          <span className='mr-2 text-sm font-semibold text-gray-600'>Email: </span> {profile?.email}
          <button
            className='absolute right-0 top-0 ml-2 rounded-tr-sm bg-gray-500 px-3 py-1 text-xs text-white transition-all active:scale-110'
            onClick={() => copyToClipboard(profile?.email || '')}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
