import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, projectDetails, quoteSummary } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // 1. Add contact to Resend "Leads" segment
    await resend.contacts.create({
      email: email,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      audienceId: '5561a7a0-2f98-444a-93be-11440026e6f5', // This is the default audience
      segmentIds: ['4ceb51ef-31b9-4051-baf3-a8e94fbc0c98'], // Leads segment
    });


    // Wait, let's use the send email with template.
    const { data, error } = await resend.emails.send({
      from: 'Ayabonga Qwabi <onboarding@qwabi.co.za>',
      to: [email],
      subject: 'Technical Co-founder: Your vision, my execution',
      templateId: '9959be1a-9989-4338-9c09-e2838688ca84',
      variables: {
        FIRST_NAME: name.split(' ')[0],
      },
    });

    if (error) {
      return res.status(400).json(error);
    }

    // 2. Send internal notification to Ayabonga
    await resend.emails.send({
      from: 'System <onboarding@qwabi.co.za>',
      to: ['ayabonga@qwabi.co.za'],
      subject: `New Lead: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nProject Details:\n${projectDetails}\n\nQuote Summary:\n${quoteSummary}`,
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
