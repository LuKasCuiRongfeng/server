import classNames from "classnames";
import { CLASS_PREFIX } from "./const";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

/** 返回带有前缀 `crf-client-` 的 classname */
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

export async function changeTheme(theme?: Theme) {
    const _theme = theme || "light";
    const vars = ["bg", "bg-hover", "titlebar", "text", "text-hover"];
    vars.forEach(v => {
        const val = getComputedStyle(document.body).getPropertyValue(
            `--${_theme}-${v}`
        );
        document.body.style.setProperty(`--${v}`, val);
    });
    // 保存到本地
    return window.ipcRenderer.invoke("ELECTRON_STORE", { theme: _theme });
}

export async function getTheme(): Promise<Theme> {
    return window.ipcRenderer.invoke("ELECTRON_STORE", "theme");
}

interface FormatterOption {
    /** 起点时间，默认为当前时间 */
    dayStart?: Dayjs;
    /** 终点时间，默认为当前时间 */
    dayEnd?: Dayjs;
    /**
     * 格式化类型 default `timestring`
     *
     * `timestring` 返回给定的本地化和按照 `YY/MM/DD`格式化后的时间
     *
     * `timefrom` 返回终点时间相对于起点时间，比如2分钟前，1天后等等，必须给出起点时间，
     * 如果没有给出终点时间，则计算起点时间和当前时间
     *
     * `timediff` 返回给定两个时间的差值，必须给出起点时间，如果没有给出终点时间
     * 则计算起点时间和当前时间
     */
    formatType?: "timestring" | "timefrom" | "timediff";
}

/** 格式化时间 */
export function timeFormatter(formatterOption?: FormatterOption) {
    dayjs.extend(relativeTime);
    const {
        dayStart = dayjs(),
        dayEnd = dayjs(),
        formatType = "timestring",
    } = formatterOption || {};
    switch (formatType) {
        case "timestring":
            if (dayStart.diff(dayEnd, "day") <= -1) {
                return dayStart.from(dayEnd);
            }
            return dayStart.format("HH:mm");
        case "timediff":
            return dayStart.diff(dayEnd, "day");
        case "timefrom":
            return dayStart.from(dayEnd);
    }
}
