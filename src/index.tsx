import "./styles/index.css";
import "./styles/classes.css";
import "./styles/table.css";
import { render } from "solid-js/web";
import { App } from "./components/App";
import { rootElement } from "./config/rootElement";

render(() => <App />, rootElement);
