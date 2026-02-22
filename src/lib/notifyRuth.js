import { supabase } from './supabase'

/**
 * Sends a notification to Ruth via the Supabase Edge Function.
 * Silently fails — notifications should never block the user flow.
 *
 * @param {'booking' | 'order' | 'message'} type
 * @param {object} data - The record data
 */
export async function notifyRuth(type, data) {
  try {
    await supabase.functions.invoke('notify-ruth', {
      body: { type, data },
    })
  } catch (err) {
    // Notification failure should not affect user experience
    console.warn('Failed to send notification to Ruth:', err)
  }
}
