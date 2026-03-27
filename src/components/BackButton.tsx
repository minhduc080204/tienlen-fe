import { BackIcon } from "../assets/icons/BackIcon"
import { Button } from "./ui/Button"

export const BackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Button
            className="p-1 sm:p-1 lg:p-4 rounded-full bg-amber-50/20 shadow-lg shadow-red-900/40 cursor-pointer"
            onClick={onClick}
        >
            <BackIcon className="w-5 sm:w-7 lg:w-10 mr-1" />
        </Button>
    )
}