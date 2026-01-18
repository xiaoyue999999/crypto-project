'use client';
import React from 'react';
import { keccak256, size, toHex } from 'viem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wallet } from 'ethers';

function generateRandomString(length = 10) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }
    return result;
}

export default function ArbPage() {
    const [bytes32Value, setBytes32Value] = React.useState<any>('');
    const [walletCount, setWalletCount] = React.useState<any>([]);

    function createWallets(num: number) {
        const wallets = [];
        const aa: any = {};
        for (let i = 0; i < num; i++) {
            const wallet = Wallet.createRandom();
            wallets.push(wallet.address);
            aa[wallet.address] = wallet.privateKey;
            console.log(`地址: ${wallet.address}`);
            console.log(`私钥: ${wallet.privateKey}`);
        }

        const wallet = Wallet.createRandom();

        localStorage.setItem(`${wallet.address}`, JSON.stringify(aa));

        console.debug('wallet', wallets);

        setWalletCount(wallets);
    }

    return (
        <main>
            <div className="p-4">
                <h1>ArbPage</h1>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ border: '1px' }}>
                    <Button onClick={() => createWallets(5)}>
                        批量创建钱包5个
                    </Button>
                </div>
                <div style={{ width: '200px' }}>
                    <Button
                        onClick={() => {
                            const min = 5000000;
                            const max = 50000000;

                            const randomInts = Array.from(
                                { length: 5 },
                                () =>
                                    Math.floor(
                                        Math.random() * (max - min + 1)
                                    ) + min
                            );

                            console.debug('randomInts', randomInts);
                        }}
                    >
                        生成随机数
                    </Button>
                </div>
                <div style={{ width: '200px' }}>
                    <Button
                        onClick={() => {
                            const count = 5; // 如果以后需要生成 10 个，只需改这里

                            const bytes32Array = Array.from(
                                { length: count },
                                () => {
                                    const randomStr = generateRandomString(10);
                                    return keccak256(
                                        toHex(randomStr, { size: 32 })
                                    );
                                }
                            );
                            const str = bytes32Array.join(', ');
                            console.debug('bytes32Array', bytes32Array);

                            setBytes32Value(str);
                        }}
                    >
                        生成随机bytes32
                    </Button>
                </div>
            </div>
        </main>
    );
}
