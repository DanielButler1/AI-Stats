import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Get current maintenance mode status from system_settings table
    // Using regular client since this is a public endpoint
    const { data, error } = await supabase
      .from('system_settings')
      .select('value, metadata')
      .eq('key', 'maintenance_mode')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('[API] Failed to get maintenance status:', error);
      // Return default state on error
      return NextResponse.json({
        enabled: false,
        message: null,
      });
    }

    // Default to false if not set
    const enabled = data?.value ?? false;
    const message = data?.metadata?.message || null;

    return NextResponse.json({
      enabled,
      message,
    });
  } catch (error) {
    console.error('[API] Failed to get maintenance status:', error);
    // Return safe defaults on error
    return NextResponse.json({
      enabled: false,
      message: null,
    });
  }
}