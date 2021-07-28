import { Center, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./App.css";
import { Demo } from "./pages/Demo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Test } from "./pages/Test";
import { Minimal } from "./pages/Minimal";

const theme = extendTheme({ config: { initialColorMode: "light" } });

function App() {
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Center p={[0, "8"]} pt="0" boxSize="100%">
                    <Switch>
                        <Route path="/test" children={<Test />} />
                        <Route path="/minimal" children={<Minimal />} />
                        <Route path="/" children={<Demo />} />
                    </Switch>
                </Center>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
