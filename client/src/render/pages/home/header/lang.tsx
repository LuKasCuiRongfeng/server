import i18n from "@/locales";
import { Button, Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Lang = () => {
    const [lang, setLang] = useState("zh");
    const { t } = useTranslation();
    return (
        <Dropdown
            overlay={
                <Menu
                    items={[
                        { label: t("中文"), key: "zh" },
                        { label: t("英文"), key: "en" },
                    ]}
                    onClick={({ key }) => {
                        i18n.changeLanguage(key);
                        setLang(key);
                    }}
                />
            }
        >
            <Button type="link">{t(lang)}</Button>
        </Dropdown>
    );
};

export default Lang;
