import "./styles/index.css";
import "./styles/classes.css";
import "./styles/table.css";
import { render } from "solid-js/web";
import { App } from "./components/App";
import { rootElement } from "./config/rootElement";
import { getHorizontalScrollbarHeight } from "./utils/getHorizontalScrollbarHeight";

render(() => <App />, rootElement);

document.body.style.setProperty("--scrollbar-horizontal-height", `${getHorizontalScrollbarHeight()}px`);
