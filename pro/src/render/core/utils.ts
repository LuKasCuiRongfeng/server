import classNames from "classnames";
import { CLASS_PREFIX } from "./const";

/** 返回带有前缀 `crf-pro-` 的 classname */
export function classnames(...args: (string | { [key: string]: any })[]) {
    const _args = args.map(d => {
        if (typeof d === "string") {
            return CLASS_PREFIX + d;
        }
        const _new = {};
        Object.keys(d).forEach(key => {
            _new[CLASS_PREFIX + key] = d[key];
        });
        return _new;
    });
    return classNames(..._args);
}

export type Theme = "light" | "dark";

export function changeTheme(theme?: Theme) {
    const _theme = theme || "light";
    const vars = ["bg", "bg-hover", "titlebar", "text", "text-hover"];
    vars.forEach(v => {
        const val = getComputedStyle(document.body).getPropertyValue(
            `--${_theme}-${v}`
        );
        document.body.style.setProperty(`--${v}`, val);
    });
}
