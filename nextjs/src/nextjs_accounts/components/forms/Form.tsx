import { FormProps } from "./types/Form.d"

export default function Form({onClick, buttonText, children}:FormProps){
  return (
    <form className="space-y-4 md:space-y-6">
      { children }
      <button  type="button" onClick={onClick}
        className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
                   font-medium rounded-lg text-sm px-5 py-2.5 text-center
                   dark:focus:ring-blue-800 shadow-lg 
                  shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80">
        { buttonText }
      </button>
    </form>
    )
}