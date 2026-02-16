export interface Faculty {
    id: string;
    name: string;
    institution: string;
    department?: string;
    email?: string;
    bio_summary?: string;
    research_interests: string[];
    embedding?: number[]; // vector(3072)
    website_url?: string;
    image_url?: string;
    is_accepting_students: boolean;
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string;
    field_of_study: string;
    resume_url?: string;
    resume_text?: string;
    embedding?: number[]; // vector(3072)
    updated_at: string;
}

export interface Interaction {
    id: string;
    user_id: string;
    faculty_id: string;
    status: 'shortlisted' | 'rejected' | 'pending';
    relevance_score?: number;
    match_explanation?: string;
    created_at: string;
}

export interface OutreachLog {
    id: string;
    interaction_id: string;
    email_body: string;
    status: 'draft' | 'sent' | 'replied';
    sent_at?: string;
    created_at: string;
}
