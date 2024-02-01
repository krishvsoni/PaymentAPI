import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        return () => clearTimeout(id);
    }, [delay, value]);

    return debounceValue;
}

