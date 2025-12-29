export interface Certificate {
    id: string;
    title: string;
    recipientName: string;
    issuer: string;
    signature: string;
    dateIssued: string;
    status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export const certificates: Certificate[] = [];