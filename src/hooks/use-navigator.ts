import {useLocation, useNavigate} from 'react-router-dom';
import {objectToParamString, searchParamsToObjectWithRepeated} from '../utils/params';

export function useBindNavigator<T>(pathname: string = window.location.pathname) {
    const navigator = useNavigate();
    const location = useLocation();

    const addToNavigateBar = (params: T) => {
        navigator(
            `${pathname}${objectToParamString({
                ...searchParamsToObjectWithRepeated(location.search),
                ...params,
            })}`,
        );
    };

    const clearNavigatorBar = (excludeParams: T) => {
        navigator(
            `${pathname}${objectToParamString({
                ...excludeParams,
            })}`,
        );
    };

    return {addToNavigateBar, clearNavigatorBar};
}
