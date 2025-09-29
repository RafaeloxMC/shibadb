interface GradientBackgroundProps {
	children: React.ReactNode;
	className?: string;
}

const GradientBackground = ({
	children,
	className,
}: GradientBackgroundProps) => {
	return (
		<div
			className={`min-h-screen w-full relative overflow-hidden flex flex-col ${
				className ? ` ${className}` : ""
			}`}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-white to-white dark:from-pink-900/20 dark:via-neutral-950 dark:to-black transition-colors duration-300"></div>

			<div className="relative z-10 flex flex-col flex-1">{children}</div>
		</div>
	);
};

export default GradientBackground;
