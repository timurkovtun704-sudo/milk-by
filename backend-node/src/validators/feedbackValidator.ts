export interface Feedback{
    id: number;
    name: string;
    email: string;
    subject: string | null ;
    message: string;
    status: string;
    created_at: string;
}

export interface CreateFeedbackDto {
    name: string;
    email: string;
    subject: string | null ;
    message: string;
}

