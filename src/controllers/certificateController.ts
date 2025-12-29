import { Request, Response, NextFunction } from 'express';
import { certificates, Certificate } from '../models/certificate';
import crypto, { randomUUID } from 'crypto';
import config from '../config/config';

const signCertificate = (data: any, privateKey: string) => {
    const payload = JSON.stringify(data);
    const hash = crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex")

    const signature = crypto.createSign("RSA-SHA256")
        .update(hash)
        .sign(privateKey, "base64");
    
    return { hash, signature };
}

const verifyCertificate = (certificate: Certificate, publicKey: string) => {
    const { signature, ...dataToVerify } = certificate;
    const dataString = JSON.stringify(dataToVerify);

    const signatureBuffer = Buffer.from(signature, "base64");

    const isValid = crypto.verify(
        "sha256",
        Buffer.from(dataString),
        { key: publicKey },
        signatureBuffer
    );
    return isValid;
};

export const createCertificate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, recipientName, issuer } = req.body;
        const id = randomUUID();

        const certificateData = { id, title, recipientName, issuer };
        const { hash, signature } = signCertificate(certificateData, config.institutionPrivateKey || '');
        const newCertificate: Certificate = {
            id,
            title,
            recipientName,
            issuer,
            signature,
            dateIssued: new Date().toISOString(),
            status: 'ACTIVE'
        };

        certificates.push(newCertificate);
        res.status(201).json(newCertificate);
    } catch (error) {
        next(error);
    }
};

export const verify = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certificate = certificates.find(cert => cert.id === id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        certificate.issuer = "Verified Issuer"; // Example modification after verification
        const isValid = verifyCertificate(certificate, config.institutionPublicKey || '');
        // Verification logic would go here (omitted for brevity)
        res.status(200).json({ valid: isValid, certificate });
    } catch (error) {
        next(error);
    }
};