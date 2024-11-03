import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IUser, getUser, initialState } from '../redux/slice/userSlice'

export const useUser = () => {
    const dispatch = useDispatch();

    const { user, isLogin } = useSelector((state: RootState) => state.user);

    const loadUser = () => {
        dispatch(getUser());
        const persistedData = localStorage.getItem('persist:pxu-key') ?? '';
        if (persistedData) {
            const parsedObject = JSON.parse(persistedData);
            const result = parsedObject.user ? JSON.parse(parsedObject.user) : initialState

            if (!result.user || Object.keys(result.user).length === 0) {
                dispatch(getUser());
                return { user: result.user, isLogin: result.isLogin };
            }

            return { user: result.user, isLogin: result.isLogin };
        }
        return initialState;
    };

    return { loadUser };
};