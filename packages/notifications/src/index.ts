export type NotificationChannels = 'email' | 'sms' | 'whatsapp';

export function getChannelConfig(channel: NotificationChannels) {
  return {
    channel,
    provider: channel === 'email' ? 'smtp' : channel === 'sms' ? 'twilio' : 'whatsapp',
  };
}
