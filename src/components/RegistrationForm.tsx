import { Prisma } from "@prisma/client";
import Option from "./Option";
import { Box, Button, Grid, Group, NumberInput, TextInput } from "@mantine/core";
import styles from "@/styles/Form.module.css";
import { useForm } from "@mantine/form";

type RegistrationFormArgs = {
    event: Prisma.eventsSelect;
};
export default function RegistrationForm({ event }: RegistrationFormArgs) {
    if (event === undefined) {
        return <h1> Event not found</h1>;
    }
    if (event.options === undefined || typeof event.options === "boolean") {
        return <h1>Internal error</h1>;
    }

    const initialValues = event.options.reduce(
        (acc: any, options: any) => ({ ...acc, [options.name]: 0 }),
        {
            email: ""
        }
    );

    const form = useForm({
        initialValues: initialValues,
    });

    const options = event.options.map((option: Prisma.optionsSelect, index: number) => (
        <Option key={index} option={option} form={form} />
    ));

    async function reserveTicket(values: any) {
        const res = await fetch("/api/reserve", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log(await res.json())
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
