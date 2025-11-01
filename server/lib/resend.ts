import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function sendWelcomeEmail(email: string, statePreference?: string) {
  try {
    const { client } = await getUncachableResendClient();
    
    const stateMessage = statePreference 
      ? `<p style="color: #4a4a4a; line-height: 1.6;">
          <strong>Your alert preference:</strong> You've chosen to receive notifications for layoffs in <strong>${statePreference}</strong>.
        </p>`
      : '';
    
    const { data, error } = await client.emails.send({
      from: 'LAYOFFS RADAR Alert <updates@layoffsradar.com>',
      to: [email],
      subject: 'Welcome to LAYOFFS RADAR',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to LAYOFFS RADAR</h1>
          <p style="color: #4a4a4a; line-height: 1.6;">
            Thank you for subscribing to LAYOFFS RADAR alerts. You'll now receive notifications when new layoff notices are filed${statePreference ? ' in ' + statePreference : ''}.
          </p>
          ${stateMessage}
          <p style="color: #4a4a4a; line-height: 1.6;">
            Our platform aggregates Worker Adjustment and Retraining Notification (WARN) Act notices from across the United States, helping you stay informed about employment changes.
          </p>
          <p style="color: #4a4a4a; line-height: 1.6;">
            You can unsubscribe at any time by replying to this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;" />
          <p style="color: #8a8a8a; font-size: 12px;">
            LAYOFFS RADAR - Tracking employment changes across America
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return { success: false, error };
  }
}
