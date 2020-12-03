export interface MailingListProvider {
  /** Adds the email to mailing list  */
  subscribe(email: string);
}
