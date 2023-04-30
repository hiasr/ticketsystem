import { Grid, NumberInput } from "@mantine/core"
import styles from "@/styles/Form.module.css"

type NumberInputArgs = {
    form: any;
    label: string;
    id: string;
}

export default function NumberFormInput({form, label, id}: NumberInputArgs) {
    return (
        <>
            <Grid.Col span={5}>
                <span className={styles.name}>{label}</span>
            </Grid.Col>
            <Grid.Col span={7}>
                <div className={styles.numberinput}>
                    <NumberInput
                        min={0}
                        {...form.getInputProps(id)}
                    />
                </div>
            </Grid.Col>
        </>
    )
}
