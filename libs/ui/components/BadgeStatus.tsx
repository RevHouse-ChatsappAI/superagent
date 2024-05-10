"use client"

import React from "react"

interface Props {
  name: string
  style: string
}

export const BadgeStatus = ({ name, style }: Props) => {
  return <div className={`${style} rounded-2xl px-3 py-1 text-xs`}>{name}</div>
}
