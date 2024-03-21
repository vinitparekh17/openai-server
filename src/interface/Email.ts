export interface EmailFormat {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
