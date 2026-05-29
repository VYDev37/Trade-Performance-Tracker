"use client";

import { useEffect, useRef } from "react";
import { useUser, useTransaction } from "@/app/stores";

export default function InitStores() {
    const initUser = useUser((state) => state.init);
    const initTransaction = useTransaction((state) => state.init);
    const isInit = useRef(false);

    useEffect(() => {
        if (!isInit.current) {
            initUser();
            initTransaction();
            isInit.current = true;
        }
    }, [initUser, initTransaction]);

    return null;
}