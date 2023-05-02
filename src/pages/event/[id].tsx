import RegistrationForm from "@/components/RegistrationForm";
import { Prisma, PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

const prisma = new PrismaClient()

export default function EventForm({ event }: { event: Prisma.EventSelect}) {
    return (
        <>
            <div className="main">
                <div>
                    <RegistrationForm event={event}/>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { id } = ctx.query

    if (typeof id != "string") {
        return 
    }

    const event = await prisma.event.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            options: true,
        }
    })
    return { props: { event: JSON.parse(JSON.stringify(event)) } }
}
