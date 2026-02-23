import { BackIcon } from "../assets/icons/BackIcon"

export const BackButton = ({onClick}: {onClick: ()=>void}) => {
    return(
        <button
            className="p-4 rounded-full bg-amber-50/20 shadow-lg shadow-red-900/40 cursor-pointer"
            onClick={onClick}
        >
            <BackIcon className="w-10 mr-1"/>
        </button>
    )
}