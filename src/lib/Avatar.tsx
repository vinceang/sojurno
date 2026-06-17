type AvatarProps = {
  label: string
}

export function Avatar({ label }: AvatarProps) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
      {label}
    </span>
  )
}
