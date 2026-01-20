import { For, type JSXElement } from "solid-js";

type MultiSelectListProps = {
    options: {
        label: JSXElement;
        value: string;
    }[];
    selected: string[];
    onChange: (selected: string[]) => void;
};

export function MultiSelectList(props: MultiSelectListProps): JSXElement {
    return (
        <div class="multi-select-list">
            <For each={props.options}>
                {(option) => (
                    <label>
                        <input
                            type="checkbox"
                            checked={props.selected.includes(option.value)}
                            onChange={(evt) => {
                                if (!evt.target.checked) {
                                    props.onChange(props.selected.filter((item) => item !== option.value));
                                } else {
                                    props.onChange([...props.selected, option.value]);
                                }
                            }}
                        />
                        {option.label}
                    </label>
                )}
            </For>
        </div>
    );
}
