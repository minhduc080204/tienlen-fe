import { useSoundStore } from "../../stores/sound.store";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, onClick, ...rest }: Props) => {
    const playClick = useSoundStore((s) => s.playClick);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        playClick();
    };

    return (
        <button {...rest} onClick={handleOnClick}>
            {children}
        </button>
    );
};