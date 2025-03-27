import React from 'react';
import {searchParamsToObjectWithRepeated} from '../utils/params';

export function useLocationParams<T>(searchParams: string) {
    const [params, setParams] = React.useState<T>(
        searchParamsToObjectWithRepeated(searchParams) as T,
    );

    React.useEffect(() => {
        setParams(searchParamsToObjectWithRepeated(searchParams) as T);
    }, [searchParams]);

    return {params};
}
