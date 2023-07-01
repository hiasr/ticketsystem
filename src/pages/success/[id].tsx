import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

type SuccessProps = {
    success: boolean;
}
        

export default function Success({ success }: SuccessProps) {
    const router = useRouter();
    const { id } = router.query
    return (
        success ?
            <p>
                Order {id} complete!
            </p>
        :
            <p>
                Order {id} failed!
            </p>

    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const prisma = new PrismaClient();
    var success = false

    const order = await prisma.order.findUnique({
        where: {
            id: id
        },
    });

    if (order) {
        const molliePayment = await fetch("https://api.mollie.com/v2/payments/" + order.paymentId, {
            headers: {
                "Authorization": "Bearer " + process.env.MOLLIE_API_KEY,
            },
        }).then((res) => res.json());
        if (molliePayment.status === "paid") {
            success = true
        }
    }

    return {
        props: {
            success,
        }
    }
}
