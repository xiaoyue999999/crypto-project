'use client';
import React from "react";
import { keccak256, size, toHex } from 'viem'
import { Input } from "@/components/ui/input";

export default function ArbPage() {
    const [bytes32Value, setBytes32Value] = React.useState<string>("");

    return (
        <main>
            <div className="p-4">
                <h1>ArbPage</h1>
            </div>

            <Input onChange={(e) => {
                const value = e.target.value;
                const bytes32 = keccak256(toHex(value, { size: 32 }));

                setBytes32Value(bytes32)
            }} /> === {bytes32Value}
        </main>
    );
}
