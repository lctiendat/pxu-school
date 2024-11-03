import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import envConfig from '../../env';

export interface IUser {
    user: string;
    isLogin: boolean;
    loading: boolean; // Thêm trạng thái loading

}

export const initialState: IUser = {
    user: '',
    isLogin: false,
    loading: false, // Khởi tạo loading là false

};

export const loginUser = createAsyncThunk<
    { user: IUser; isLogin: boolean },
    { studentId: string; password: string },
    { rejectValue: string }
>(
    'user/loginUser',
    async ({ studentId, password }, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.phuxuan.edu.vn/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    lname: studentId,
                    pass: password,
                    submit: 1,
                    _sand_ajax: 1,
                    _sand_platform: 3,
                    _sand_readmin: 1,
                    _sand_is_wan: false,
                    _sand_ga_sessionToken: '',
                    _sand_ga_browserToken: '',
                    _sand_domain: 'phuxuan',
                    _sand_maske: ''
                }).toString()
            });


            console.log(await response?.json());


            // Kiểm tra response.ok trước khi parse JSON
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('medtou-accesstoken', data.token); // Lưu token vào localStorage
            return { user: data.user, isLogin: true };
        } catch (error) {
            // Kiểm tra xem error có phải là instance của Error không để có thể lấy message
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong during login';
            return rejectWithValue(errorMessage);
        }
    }
);

export const getUser: any = createAsyncThunk('user/getUser', async () => {
    try {
        const response = await fetch(envConfig.API_URL + 'user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
            },
        });
        const data = await response.json();

        if (!response.ok || !data?.status) {
            throw new Error('Network response was not ok');
        }
        return data.data;
    } catch (error) {
        throw new Error('Something went wrong');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLogin = true;
            })
            .addCase(getUser.rejected, (state) => {
                state.isLogin = false;
                // state.user = initialState
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true; // Bắt đầu loading
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.user = action.payload.user;
                state.isLogin = true;
                state.loading = false; // Kết thúc loading
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLogin = false;
                state.loading = false; // Kết thúc loading
                console.error(action.payload);
            });;
    },
});

export default userSlice.reducer;