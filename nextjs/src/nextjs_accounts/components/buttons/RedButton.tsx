import { ColorButtonProps } from "./types/Button"
import BaseButton from "./BaseButton"

export default function BlueButton({onClick = undefined, size="lg", children }:
                                    ColorButtonProps,
                                  ){
  let textsize:{[index:string]:string} = {'xs':'text-xs','sm':'text-sm', 'md':'text-md','lg':'text-lg'}
  let className=`relative inline-flex items-center justify-center p-0.5 
                 mb-2 mr-2 overflow-hidden ${textsize[size]} font-medium text-gray-900 
                 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 
                 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 
                 dark:text-white dark:hover:text-gray-900 focus:ring-4 
                 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400`
  return(
    <BaseButton onClick={onClick} 
                size={size}
                className={className}>
      {children}
    </BaseButton>
  )
}