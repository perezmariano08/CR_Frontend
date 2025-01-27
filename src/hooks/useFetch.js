import { useEffect, useState } from "react";

const useFetch = (functionFetch, params, refresh) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await functionFetch(params)
                setData(response);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [functionFetch, params, refresh]);

    return { data, loading, error };
};

export default useFetch;