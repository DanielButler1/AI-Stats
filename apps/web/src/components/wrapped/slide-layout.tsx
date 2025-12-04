import * as React from "react";

interface SlideLayoutProps {
	children: React.ReactNode;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({ children }) => (
	<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
		{children}
	</div>
);
