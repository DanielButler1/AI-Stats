"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handlePasswordSignIn } from "@/app/(auth)/sign-in/actions";

export default function EmailPassword() {
	return (
		<div className="grid gap-4">
			<div className="flex items-center gap-2">
				<div className="flex-1 border-t border-border" />
				<span className="px-2 text-sm text-muted-foreground">
					Or sign in with email
				</span>
				<div className="flex-1 border-t border-border" />
			</div>

			<form action={handlePasswordSignIn} className="grid gap-3">
				<div className="grid gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="ai-stats@example.com"
						required
					/>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
						<Link
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<Input
						id="password"
						name="password"
						type="password"
						required
					/>
				</div>

				<Button type="submit" className="w-full">
					Sign in with email
				</Button>
			</form>

			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link href="/sign-up" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</div>
	);
}
