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

import axios from 'axios';

export const loginUser = createAsyncThunk<
    { user: IUser; isLogin: boolean },
    { studentId: string; password: string },
    { rejectValue: string }
>(
    'user/loginUser',
    async ({ studentId, password }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('lname', studentId);
            params.append('pass', password);
            params.append('submit', '1');
            params.append('_sand_ajax', '1');
            params.append('_sand_platform', '3');
            params.append('_sand_readmin', '1');
            params.append('_sand_is_wan', 'false');
            params.append('_sand_ga_sessionToken', '');
            params.append('_sand_ga_browserToken', '');
            params.append('_sand_domain', 'phuxuan');
            params.append('_sand_maske', '');

            const response = await axios.post(`https://cors-anywhere.herokuapp.com/https://api.phuxuan.edu.vn/user/login`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.status !== 200 || !!!response.data.success) {
                return rejectWithValue(response.data.message || 'Login failed');
            }

            const data = response.data;

            localStorage.setItem('pxu-token', data.result.token);
            localStorage.setItem('pxu-id', data.result.id);
            localStorage.setItem('pxu-iid', data.result.iid);

            return { user: data.result, isLogin: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong during login';
            return rejectWithValue(errorMessage);
        }
    }
);


export const getUser: any = createAsyncThunk('user/getUser', async () => {
    try {
        const token = localStorage.getItem('pxu-token');
        const id = localStorage.getItem('pxu-id');
        const iid = localStorage.getItem('pxu-iid');

        const response = await axios.get(`https://api.phuxuan.edu.vn/user/api/full-info`, {
            params: {
                submit: 1,
                _sand_ajax: 1,
                _sand_platform: 3,
                _sand_readmin: 1,
                _sand_is_wan: false,
                _sand_ga_sessionToken: '',
                _sand_ga_browserToken: '',
                _sand_domain: 'phuxuan',
                _sand_masked: '',
                _sand_token: token,
                _sand_uiid: iid,
                _sand_uid: id,
            },
        });

        const data = response.data;


        if (response.status !== 200 || !data.success) {
            throw new Error('Network response was not ok');
        }
        return data.result;
    } catch (error) {
        throw new Error('Something went wrong');
    }
});

export const getTranscript: any = createAsyncThunk('user/getTranscript', async () => {
    try {
        const token = localStorage.getItem('pxu-token');
        const id = localStorage.getItem('pxu-id');
        const iid = localStorage.getItem('pxu-iid');

        const response = await axios.get(`https://api.phuxuan.edu.vn/student/api/get-transcript`, {
            params: {
                user_iid: 2159,
                major: 10025,
                ico: 340715,
                training_level: 'university',
                training_mode: 'regular',
                group_by: 'semester',
                submit: 1,
                page: 1,
                items_per_page: 10,
                _sand_ajax: 1,
                _sand_platform: 3,
                _sand_readmin: 1,
                _sand_is_wan: false,
                _sand_ga_sessionToken: '',
                _sand_ga_browserToken: '',
                _sand_domain: 'phuxuan',
                _sand_masked: '',
                _sand_token: 'b5913_PDqru',
                _sand_uiid: 2159,
                _sand_uid: '631558752cea4750367abd7f'
            }
        });

        const data = response.data;


        if (response.status !== 200 || !data.success) {
            throw new Error('Network response was not ok');
        }
        return data.result;
    } catch (error) {
        throw new Error('Something went wrong');
    }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    // Bạn có thể thêm logic để xóa token hoặc làm sạch dữ liệu khác nếu cần
    localStorage.removeItem('pxu-token'); // Xóa token
    localStorage.removeItem('pxu-id'); // Xóa ID
    localStorage.removeItem('pxu-iid'); // Xóa IID
    localStorage.clear()
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