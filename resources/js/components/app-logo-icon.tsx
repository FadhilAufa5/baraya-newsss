import type { ImgHTMLAttributes } from 'react';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    alt?: string;
}

export default function AppLogoIcon({
    className = 'h-14 w-auto',
    alt = 'Baraya News Logo',
    ...props
}: AppLogoIconProps) {
    return (
        <img
            src="/logoB.png"
            alt={alt}
            className={`object-contain shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
            {...props}
        />
    );
}
