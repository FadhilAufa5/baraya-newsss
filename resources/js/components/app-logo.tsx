import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5 select-none">
            <AppLogoIcon className="h-14 w-auto object-contain" />
            <div className="grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-black tracking-tight text-gray-800 dark:text-white">
                    araya<span className="text-red-600">News</span>
                </span>
            </div>
        </div>
    );
}
