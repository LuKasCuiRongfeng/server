import { useEffect, useState } from "react";

const useRefresh = () => {
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh) {
            setRefresh(false);
        }
    }, [refresh]);

    return [refresh, setRefresh] as const;
};

export default useRefresh;
