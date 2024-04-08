import NextImage from "next/image"

export default function Logo({
  width = 38,
  height = 38,
}: {
  width?: number
  height?: number
}) {
  return (
    <NextImage
      className="rounded-sm"
      src="/logo.png"
      alt="ChatsApp"
      width={width}
      height={height}
    />
  )
}
