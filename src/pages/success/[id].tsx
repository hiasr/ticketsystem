import { useRouter } from "next/router";

export default function Success() {
    const router = useRouter();
    const { id } = router.query
    return (
        <p>
            Order {id} complete!
        </p>
    )
}
