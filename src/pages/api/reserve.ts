import { Prisma, PrismaClient, options, orders } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type RequestBody = {
  event: Prisma.eventsSelect; 
  form_values: Object;
}

type ReturnBody = {
    order_id: string,
    payment_url: string,
}

type Event = Prisma.eventsGetPayload<{
        include: {
            options: true;
        };
    }>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnBody>,
) {
    const prisma = new PrismaClient();
    const values = req.body.form_values;

    const event = add_options_amount(req.body.event, values);
    const order = await reserve_tickets(prisma, event, values.email);
    const payment = await create_payment(event, order);
    console.log(payment)

    res.status(200).json({order_id: order.id, payment_url: payment._links.checkout.href})
}

function add_options_amount(event: Event, values: any) {
    var new_event = event;
    var options = new_event.options;
    for (let i=0; i < options.length; i++) {
        if (Object.keys(values).includes(options[i].id.toString())) {
            new_event.options[i].amount = values[options[i].id]
        } else {
            new_event.options[i].amount = 0
        }
    }
    return new_event;
}


function create_tickets_list(event) {
    const options = event.options;
    var tickets: any[] = [];
    for (let i=0; i < options.length; i++) {
        if (options[i].amount > 0) {
            tickets = tickets.concat(Array(options[i].amount).fill({
                    event_id: event.id,
                    option_id: options[i].id,
            }))
        }
    }
    return tickets
}

async function reserve_tickets(prisma: PrismaClient, event: Event, user: string) {
    const tickets = create_tickets_list(event);
    const order = await prisma.orders.create({
        data: {
            user: user,
            tickets: {
                create: tickets
            }
        }
    })
    return order
}

async function create_payment(event: Event, order: orders) {
    const amount = event.options.reduce((acc: number, option: options) => acc + option.price * option.amount,0);
    const amount_string = Math.floor(amount/100) + "." + amount % 100

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
