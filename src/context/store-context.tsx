'use client';

import React, {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    Dispatch,
} from 'react';

// 1. 定义状态类型 (根据你的看板需求预设)
interface GlobalState {
    theme?: string;
    userAddress?: string;
    fundingData?: any[];
    [key: string]: any; // 保持灵活性
}

// 2. 定义 Action 类型
interface Action {
    type: string;
    payload: Partial<GlobalState>;
}

// 3. 定义 Context 的接口类型
interface GlobalStoreContextType {
    state: GlobalState;
    dispatch: Dispatch<Action>;
}

// 4. 创建 Context
const GlobalStoreContext = createContext<GlobalStoreContextType | undefined>(
    undefined
);

/**
 * 内部 Provider 包装组件
 */
const GlobalStoreProvider = ({
    children,
    state,
    dispatch,
}: {
    children: ReactNode;
    state: GlobalState;
    dispatch: Dispatch<Action>;
}) => {
    return (
        <GlobalStoreContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStoreContext.Provider>
    );
};

/**
 * Hook: 获取全局状态 (State)
 */
export const useGlobalState = () => {
    const context = useContext(GlobalStoreContext);
    if (!context) {
        throw new Error('useGlobalState 必须在 RootProvider 内部使用');
    }
    return context.state;
};

/**
 * Hook: 获取派发方法 (Dispatch)
 */
export const useGlobalDispatch = () => {
    const context = useContext(GlobalStoreContext);
    if (!context) {
        throw new Error('useGlobalDispatch 必须在 RootProvider 内部使用');
    }
    return context.dispatch;
};

/**
 * Reducer 逻辑
 */
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
    switch (action.type) {
        case 'UPDATE_STATE':
            return { ...state, ...action.payload };
        default:
            // 默认行为：合并 payload
            return { ...state, ...action.payload };
    }
};

/**
 * 根 Provider (在 layout.tsx 中引用)
 */
export const RootProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(globalReducer, {});

    return (
        <GlobalStoreProvider state={state} dispatch={dispatch}>
            {children}
        </GlobalStoreProvider>
    );
};
