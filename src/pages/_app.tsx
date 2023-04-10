import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "light",
                fontFamily: "Open Sans, sans serif",
                primaryShade: { light: 5, dark: 7 },
                colors: {
                    "vtk-yellow": [
                        "#E4C428",
                        "#E8C721",
                        "#EDCA19",
                        "#F3CD11",
                        "#F9D009",
                        "#FFD400",
                        "#F6CE06",
                        "#EEC80C",
                        "#E6C212",
                        "#DEBD17",
                    ],
                },
            }}
        >
            <Component {...pageProps} />
        </MantineProvider>
    );
}
