import { Request, Response, NextFunction } from 'express';
import crypto, { randomUUID } from 'crypto';
import config from '../config/config';
import { prisma } from '../lib/prisma';

const signCertificate = (data: any, privateKey: string) => {
    const payload = JSON.stringify(data);
    const signature = crypto.sign("sha256", Buffer.from(payload), privateKey).toString("base64");
    return signature;
}

const verifyCertificate = (certificate: any, publicKey: string) => {
    console.log(certificate);
    const { signature, ...dataToVerify } = certificate;
    const payload = JSON.stringify(dataToVerify);

    const isValid = crypto.verify(
        "sha256",
        Buffer.from(payload),
        publicKey,
        Buffer.from(signature, "base64")
    );
    return isValid;
};

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, recipientName, issuer } = req.body;
        const id = randomUUID();
        const payload = { id, title, recipientName, issuer, dateIssued: new Date().toISOString(), status: 'ACTIVE' };
        const signature = signCertificate(payload, config.institutionPrivateKey || '');
        const created = await prisma.certificates.create({ data: { ...payload, signature } });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certificate = await prisma.certificates.findUnique({ where: { id } });
        // console.log(certificate);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // console.log(config.institutionPublicKey);
        const data = { 
            id: certificate.id,
            title: certificate.title,
            recipientName: certificate.recipientName,
            issuer: certificate.issuer,
            dateIssued: certificate.dateIssued,
            status: certificate.status,
            signature: certificate.signature
        }

        const isValid = verifyCertificate(data, config.institutionPublicKey || '');
        // Verification logic would go here (omitted for brevity)
        res.status(200).json({ valid: isValid, certificate });
    } catch (error) {
        next(error);
    }
};

export const getAllCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCertificates = await prisma.certificates.findMany();
        res.json(allCertificates);
    } catch (error) {
        next(error);
    }
};