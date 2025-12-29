import { Request, Response, NextFunction } from "express";
import { users } from "../models/user";
import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.send(allUsers);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = { id: randomUUID(), ...req.body };
        const created = await prisma.user.create({ data: newUser });
        res.status(201).send(created);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const updated = await prisma.user.update({ where: { id: userId }, data: { name: req.body.name, email: req.body.email }});
        res.send(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.user.delete({ where: { id: req.params.id } });
        res.send(result);
    } catch (error) {
        next(error);
    }
};