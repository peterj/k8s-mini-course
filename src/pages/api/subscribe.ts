import { MailchimpProvider } from 'src/lib/mailchimpProvider';

export default async (req, res) => {
  const { email, tags } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await new MailchimpProvider().subscribe(email);
    return res.status(201).json({ error: '' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || error.toString() });
  }
};
