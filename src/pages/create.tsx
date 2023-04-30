import { Button, Divider, Grid, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import styles from "@/styles/Form.module.css";
import StringInput from "@/components/StringInput";
import { useState } from "react";
import NewOption from "@/components/NewOption";
import NumberFormInput from "@/components/NumberFormInput";

type Option = ReturnType<typeof NewOption>;

export default function Create() {
    const form = useForm()
    const [options, setOptions] = useState<number[]>([]);
    const [newOptionId, setNewOptionId] = useState(1);

    function addOption() {
        setOptions([...options, newOptionId]);
        setNewOptionId(newOptionId + 1);
    }

    const removeOption = (id: number) => {
        setOptions(options.filter((option) => option !== id));
    }

    async function createEvent() {
        const optionArray = options.map((i, _) => {
            return {
                name: form.values[`${i}-name`],
                price: form.values[`${i}-price`],
                maxTickets: form.values[`${i}-tickets`],
            }
        });
        const event = {
            name: form.values.name,
            description: form.values.description,
            options: optionArray,
            maxTickets: form.values["max-tickets"],
        };

        const res = await fetch("/api/event/create", {
            method: "POST",
            body: JSON.stringify(event),
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log(res.body)
    }

    return (
        <div className={styles.form}>
            <Group className={styles.group}>
                <h1 className={styles.title}>Create Event</h1>
                <h2 className={styles.subtitle}>Algemene gegevens</h2>
                <Grid>
                    <StringInput form={form} label="Naam Event" id="name" />
                    <StringInput form={form} label="Beschrijving Event" id="description" />
                    <NumberFormInput form={form} label="Totaal max tickets" id="max-tickets" />
                </Grid>
                <h2 className={styles.subtitle}>Opties</h2>
                {options.map((option) => <NewOption form={form} id={option} removeOption={removeOption} />)}
                <Button color="vtk-yellow" onClick={() => addOption()}>Nieuwe optie</Button>
                <Divider />
                <Button color="vtk-yellow" onClick={() => createEvent()}>Submit</Button>
            </Group>
        </div>
    )
}
