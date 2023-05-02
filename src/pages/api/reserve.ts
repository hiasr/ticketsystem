import { Prisma, PrismaClient, Option, Order } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type RequestBody = {
    event: Prisma.EventSelect;
    form_values: Object;
}

type ReturnBody = {
    order_id: string,
    payment_url: string,
} | { error?: string }

type Event = Prisma.EventGetPayload<{
    include: {
        options: true;
    };
}>;
type OptionWithAmount = Option & { amount: number };
type EventWithAmount = Event & { options: OptionWithAmount[] };


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ReturnBody>,
) {
    const prisma = new PrismaClient();
    const values = req.body.form_values;

    const event = add_options_amount(req.body.event, values);
    var order = null;
    try {
        order = await reserve_tickets(prisma, event, values.email);
    } catch (e: any) {
        var errorMessage;
        if (typeof e === "string") {
            errorMessage = e.toUpperCase()
        } else if (e instanceof Error) {
            errorMessage = e.message
        } else {
            errorMessage = "Not enough tickets left"
        }
        res.status(200).json({ error: errorMessage });
        return
    }
    const payment = await create_payment(event, order);

    res.status(200).json({ order_id: order.id, payment_url: payment._links.checkout.href })
}

function add_options_amount(event: Event, values: any): EventWithAmount {
    var new_event = event;
    var options = new_event.options;
    for (let i = 0; i < options.length; i++) {
        if (Object.keys(values).includes(options[i].id.toString())) {
            new_event.options[i].amount = values[options[i].id]
        } else {
            new_event.options[i].amount = 0
        }
    }
    return new_event;
}


function create_tickets_list(event: EventWithAmount) {
    const options = event.options;
    var tickets: any[] = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].amount > 0) {
            tickets = tickets.concat(Array(options[i].amount).fill({
                eventId: event.id,
                optionId: options[i].id,
            }))
        }
    }
    return tickets
}

async function reserve_tickets(prisma: PrismaClient, event: EventWithAmount, user: string) {
    const tickets = create_tickets_list(event);
    return await prisma.$transaction(async (tx) => {
        const soldTickets = await tx.ticket.findMany({
            where: {
                eventId: event.id,
            },
        })

        if (soldTickets.length + tickets.length > event.maxTickets) {
            throw new Error("Not enough tickets left for event")
        }

        for (let i = 0; i < event.options.length; i++) {
            if (event.options[i].amount > 0) {
                const soldTicketsOption = soldTickets.filter((ticket) => ticket.optionId == event.options[i].id).length;
                if (soldTicketsOption + event.options[i].amount > event.options[i].maxTickets) {
                    throw new Error("Not enough tickets left for option " + event.options[i].name)
                }
            }
        }

        const order = await tx.order.create({
            data: {
                user: user,
                tickets: {
                    create: tickets
                }
            }
        })

        return order
    })
}

async function create_payment(event: EventWithAmount, order: Order) {
    const amount = event.options.reduce((acc: number, option: OptionWithAmount) => acc + option.price * option.amount, 0);
    const amount_string = Math.floor(amount / 100) + "." + amount % 100

    const payment_promise = await fetch("https://api.mollie.com/v2/payments", {
        method: "POST",
        body: JSON.stringify({
            amount: {
                "currency": "EUR",
                "value": amount_string
            },
            description: event.name + " " + order.id,
            redirectUrl: process.env.VERCEL_URL + "/success/" + order.id,
            metadata: {
                event_id: event.id,
                order_id: order.id,
            }
        }),
        headers: {
            "Authorization": "Bearer " + process.env.MOLLIE_API_KEY,
            "Content-Type": "application/json"
        }
    })
    return payment_promise.json()
}
