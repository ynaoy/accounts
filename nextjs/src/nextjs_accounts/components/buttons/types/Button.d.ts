import React from "react"

type BaseButtonProps = { onClick?: (event: React.MouseEvent | React.TouchEvent) => void,
                       size?: "xs" | "sm" | "md" | "lg",
                       children: React.ReactNode}

export type ColorButtonProps = BaseButtonProps

export type ButtonProps = BaseButtonProps & { className: string }