import classNames from "classnames";
import { CLASS_PREFIX } from "./const";

/** 返回带有前缀的classname */
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
