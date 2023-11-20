interface MailerOptionProps {
    email: string;
    subject: string;
    message: string;
}
export declare const sendEmail: (options: MailerOptionProps) => Promise<void>;
export {};
