// Supabase Edge Function: notify-ruth
// Sends Ruth a WhatsApp message via Twilio when a booking or order comes in.
//
// Required env vars (set via Supabase Dashboard > Edge Functions > Secrets):
//   TWILIO_ACCOUNT_SID   - Twilio Account SID
//   TWILIO_AUTH_TOKEN     - Twilio Auth Token
//   TWILIO_WHATSAPP_FROM  - Twilio WhatsApp sender (e.g. whatsapp:+14155238886)
//   SUPABASE_URL          - auto-injected
//   SUPABASE_SERVICE_ROLE_KEY - auto-injected

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    // type: "booking" | "order" | "message"
    // data: the record that was inserted

    // Get Ruth's WhatsApp number from site_content
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: contactRow } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "contact_whatsapp")
      .single()

    const ruthNumber = contactRow?.value?.replace(/\D/g, "") || ""
    if (!ruthNumber) {
      return new Response(JSON.stringify({ error: "Ruth's WhatsApp number not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Build the message based on type
    let message = ""

    if (type === "booking") {
      const name = `${data.first_name || ""} ${data.last_name || ""}`.trim()
      message = [
        `New Booking Request!`,
        ``,
        `Name: ${name}`,
        `Service: ${data.service || "Not specified"}`,
        `WhatsApp: ${data.whatsapp || "N/A"}`,
        `Email: ${data.email || "N/A"}`,
        data.preferred_date ? `Date: ${data.preferred_date}` : null,
        data.budget_range ? `Budget: ${data.budget_range}` : null,
        data.vision ? `Vision: ${data.vision}` : null,
      ].filter(Boolean).join("\n")
    } else if (type === "order") {
      message = [
        `New Order Placed!`,
        ``,
        `Customer: ${data.customer_name || "N/A"}`,
        `WhatsApp: ${data.customer_whatsapp || "N/A"}`,
        `Total: ₦${Number(data.total || 0).toLocaleString()}`,
        `Payment: ${data.payment_method || "N/A"}`,
        `Items: ${data.item_count || "N/A"} piece(s)`,
      ].filter(Boolean).join("\n")
    } else if (type === "message") {
      message = [
        `New Message!`,
        ``,
        `From: ${data.name || "N/A"}`,
        `Subject: ${data.subject || "General"}`,
        `WhatsApp: ${data.whatsapp || "N/A"}`,
        `Email: ${data.email || "N/A"}`,
        `Message: ${data.message || "N/A"}`,
      ].filter(Boolean).join("\n")
    } else {
      message = `New notification from SBR website: ${JSON.stringify(data).slice(0, 500)}`
    }

    // Send via Twilio WhatsApp API
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID")!
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN")!
    const fromNumber = Deno.env.get("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886"

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const params = new URLSearchParams({
      To: `whatsapp:+${ruthNumber}`,
      From: fromNumber,
      Body: message,
    })

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const twilioResult = await twilioResponse.json()

    if (!twilioResponse.ok) {
      console.error("Twilio error:", twilioResult)
      return new Response(JSON.stringify({ error: "Failed to send WhatsApp message", details: twilioResult }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true, messageSid: twilioResult.sid }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Edge function error:", err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
