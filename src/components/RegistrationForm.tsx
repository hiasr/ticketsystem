import { Prisma, Event} from "@prisma/client";
import Option from "./Option";
import { Box, Button, Grid, Group, NumberInput, TextInput } from "@mantine/core";
import styles from "@/styles/Form.module.css";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useState } from "react";

type RegistrationFormArgs = {
    event: Prisma.EventGetPayload<{
        include: {
            options: true;
        };
    }>;
};


export default function RegistrationForm({ event }: RegistrationFormArgs) {
    if (event === undefined) {
        return <h1> Event not found</h1>;
    }
    if (event.options === undefined || typeof event.options === "boolean") {
        return <h1>Internal error</h1>;
    }


    const form = useForm({});
    const router = useRouter();
    const [error, setError] = useState<string>("An error occured");

    const options = event.options.map((option: any, index: number) => (
        <Option key={index} option={option} form={form} />
    ));

    async function reserveTicket(values: any) {
        const data = {
            event: event,
            form_values: values
        }
        const res = await fetch("/api/reserve", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!res.ok) {
            setError("Something went wrong, try again later")
        }

        const res_data = await res.json()
        if (res_data.error) {
            setError(res_data.error)
            return
        }
        // Necessary to include router.query for it to work (access to dynamic url)
        router.push({
            pathname: res_data.payment_url,
            query: { ...router.query }
        })
    }

    return (
        <form onSubmit={form.onSubmit((values) => reserveTicket(values))}>
            <Box className={styles.form}>
                <h1 className="title">{event.name}</h1>
                <p>{event.description}</p>

                <Grid justify="center" className={styles.grid}>
                    <Grid.Col span={3}>
                        <div className={styles.name}>Email</div>
                    </Grid.Col>
                    <Grid.Col span={2} />
                    <Grid.Col span={7}>
                        <div className={styles.numberinput}>
                            <TextInput
                                min={0}
                                {...form.getInputProps("email")}
                            />
                        </div>
                    </Grid.Col>

                    {options}
                    <Grid.Col span={4}>
                        <span className={styles.errorMessage}>
                            {error}
                        </span>
                        <Button
                            type="submit"
                            className={styles.submit}
                            color="vtk-yellow"
                        >
                            Submit
                        </Button>
                    </Grid.Col>
                </Grid>
            </Box>
        </form>
    );
}
