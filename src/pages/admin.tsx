import { PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext } from "next/types";
import { Event } from "@prisma/client";
import { Table } from "@mantine/core";
import Link from "next/link";

export default function Admin({ events }: { events: Event[] }) {
    const rows = events.map((event: Event) => (
        <tr key={event.id}>
            <Link href={`/event/${event.id}`}>
                <td>{event.name}</td>
            </Link>
            <td>{event.description}</td>
            <td>{event.maxTickets}</td>
        </tr>
    ));
    return (
        <div>
            <h1>Admin</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Naam</th>
                        <th>Beschrijving</th>
                        <th>Max Tickets</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const prisma = new PrismaClient();
    const events = await prisma.event.findMany();
    return {
        props: {
            events: JSON.parse(JSON.stringify(events)),
        },
    }
}
