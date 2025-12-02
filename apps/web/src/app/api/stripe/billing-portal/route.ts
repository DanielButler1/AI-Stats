import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const customerId = body?.customerId;
        const returnUrl = body?.returnUrl || `${process.env.WEBSITE_URL || "http://localhost:3001"}/dashboard`;

        if (!customerId) {
            return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
        }

        const stripe = getStripe();

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.log("[ERROR] /api/stripe/billing-portal:", String(err));
        return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
    }
}
