import { Prisma } from "@prisma/client";
import { Grid, NumberInput } from "@mantine/core";
import styles from "@/styles/Form.module.css";

type OptionArgs = {
    option: Prisma.optionsSelect;
    form: any
};
export default function Option({ option, form }: OptionArgs) {
    return (
        <>
            <Grid.Col span={3}>
                <span className={styles.name}>{option.name}</span>
            </Grid.Col>
            <Grid.Col span={2}>
                € {option.price / 100}
            </Grid.Col>
            <Grid.Col span={7}>
                <div className={styles.numberinput}>
                    <NumberInput
                        min={0}
                        {...form.getInputProps(option.id.toString())}
                    />
                </div>
            </Grid.Col>
        </>
    );
}
