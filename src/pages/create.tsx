import { Box, Grid, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import styles from "@/styles/Form.module.css";

export default function Create() {
    const form = useForm()

    return (
        <div className={styles.form}>
            <Group className={styles.group}>
                <h1 className={styles.title}>Create Event</h1>
                    <Grid>
                        
                    </Grid>
            </Group>
        </div>
    )
}
