import { Button, Divider, Grid } from "@mantine/core";
import StringInput from "./StringInput";
import CurrencyInput from "./CurrencyInput";
import NumberFormInput from "./NumberFormInput";


export default function NewOption({ form, id, removeOption }: any) {
    return (
        <div key={id} className="flex-center">
            <Grid justify="center">
                <StringInput form={form} label="Naam optie" id={`${id}-name`} />
                <CurrencyInput form={form} label="Prijs optie" id={`${id}-price`} />
                <NumberFormInput form={form} label="Max tickets" id={`${id}-tickets`} />
            </Grid>
            <Button color="vtk-yellow" style={{ margin: "2em 2em"}} onClick={() => removeOption(id)}>Verwijder optie</Button>
            <Divider my="sm" />
        </div>
    )

}
