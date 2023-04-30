import { Grid, TextInput } from "@mantine/core"
import styles from "@/styles/Form.module.css"

type StringInputArgs = {
    form: any;
    label: string;
    id: string;
}

export default function StringInput({form, label, id}: StringInputArgs) {
    return (
        <>
            <Grid.Col span={5}>
                <span className={styles.name}>{label}</span>
            </Grid.Col>
            <Grid.Col span={7}>
                <div className={styles.numberinput}>
                    <TextInput
                        {...form.getInputProps(id)}
                    />
                </div>
            </Grid.Col>
        </>
    )
}
