'use client';
import { Button } from '@/components/ui/button';
import { useGlobalDispatch, useGlobalState } from '@/context/store-context';

export default function ArbPage() {
    const state = useGlobalState();
    const dispatch = useGlobalDispatch();

    return (
        <main>
            <div className="p-4">
                <h1>ArbPage</h1>
                <h2>{state?.theme}</h2>

                <Button
                    onClick={() => {
                        dispatch({
                            type: 'UPDATE_STATE',
                            payload: { theme: 'dark' },
                        });
                    }}
                >
                    修改展示 --- dark
                </Button>
                <Button
                    onClick={() => {
                        dispatch({
                            type: 'UPDATE_STATE',
                            payload: { theme: 'nihao' },
                        });
                    }}
                >
                    修改展示 --- i
                </Button>
            </div>
        </main>
    );
}
