import React from "react"

export type FormProps = { 
  onClick?: (event:React.MouseEvent<HTMLButtonElement>)=>void,
  buttonText:string, 
  children?: React.ReactNode}

export type FormItemProps = { 
  onChange?: (event:React.ChangeEvent<HTMLInputElement>)=>void,
  id: string,
  labelText:string, 
  type?:string,
  errorMessage?:string }