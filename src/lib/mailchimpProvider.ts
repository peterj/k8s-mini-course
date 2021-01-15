import fetch from 'isomorphic-unfetch';
import crypto from 'crypto';

import { MailingListProvider } from './mailingListProvider';

const MAILCHIMP_SERVER_NAME = process.env.MAILCHIMP_SERVER_NAME;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_SUBSCRIBER_TAG = process.env.MAILCHIMP_SUBSCRIBER_TAG;

export class MailchimpProvider implements MailingListProvider {
  public async subscribe(email: string) {
    const exists = await this.subscriberExists(email);
    if (exists) {
      await this.tagSubscriber(email, MAILCHIMP_SUBSCRIBER_TAG);
    } else {
      await this.addSubscriber(email, MAILCHIMP_SUBSCRIBER_TAG);
    }
  }

  private async addSubscriber(email: string, tag: string) {
    const url = `https://${MAILCHIMP_SERVER_NAME}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
    const tags = JSON.stringify({
      name: tag,
      status: 'active',
    });

    const data = {
      email_address: email,
      // Requires user to confirm the email address (set to 'subscribed' to skip it).
      status: 'pending',
      tags: [tags],
    };

    try {
      const response = await fetch(url, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthToken(MAILCHIMP_API_KEY),
        },
        method: 'POST',
      });

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Tags the subscribers' email with specified tag
   * @param email
   * @param tag
   */
  private async tagSubscriber(email: string, tag: string): Promise<boolean> {
    const subscriberHash = this.getMd5Hash(email);
    const url = `https://${MAILCHIMP_SERVER_NAME}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;

    try {
      await fetch(url, {
        body: JSON.stringify({
          tags: [
            {
              name: tag,
              status: 'active',
            },
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthToken(MAILCHIMP_API_KEY),
        },
        method: 'POST',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Checks if subscriber exists
   * @param email
   */
  private async subscriberExists(email: string): Promise<boolean> {
    const subscriberHash = this.getMd5Hash(email);
    const url = `https://${MAILCHIMP_SERVER_NAME}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthToken(MAILCHIMP_API_KEY),
        },
        method: 'GET',
      });
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Returns an MD5 hash of the provided value
   * @param value
   */
  private getMd5Hash(value: string): string {
    return crypto.createHash('md5').update(value.toLowerCase()).digest('hex');
  }

  /**
   * Returns the basic auth token use in the request
   * @param apiKey
   */
  private getAuthToken(apiKey: string): string {
    return `Basic ${apiKey}`;
  }
}
