import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type CreateEventInput = {
    name: string;
    description: string;
    maxTickets: number;
    options: {
        name: string;
        price: number;
        tickets: number;
    }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, description, maxTickets, options }: CreateEventInput = req.body;
    const prisma = new PrismaClient();
    const fixedOptions = options.map(option => {return {...option, price: Math.floor(option.price * 100)}});

    const event = await prisma.event.create({
        data: {
            name,
            description,
            maxTickets,
            options: {
                create: fixedOptions
            }
        }
    })
    res.status(200).json({ event });
}
