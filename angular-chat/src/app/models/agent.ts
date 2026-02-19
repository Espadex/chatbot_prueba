
export interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    status: 'Confidential' | 'Unrestricted';
    canEdit: boolean;
    link?: string;
}
