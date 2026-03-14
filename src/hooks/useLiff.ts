import liff from "@line/liff";
import { useState, useEffect } from "react";

export const useLiff = () => {
    const [lineUserId, setLineUserId] = useState<string | null>(null);
    const [isLiffReady, setIsLiffReady] = useState(false);
    const [liffError, setLiffError] = useState<string | null>(null);

    useEffect(() => {
        const liffId = import.meta.env.VITE_LIFF_ID;
        if (!liffId) {
            console.error("VITE_LIFF_ID is not defined");
            return;
        }

        console.log("Initializing LIFF with ID:", liffId);
        liff.init({ liffId })
            .then(() => {
                console.log("LIFF Initialization Success");
                setIsLiffReady(true);
                if (liff.isLoggedIn()) {
                    console.log("User is already logged in to LINE");
                    liff.getProfile().then(profile => {
                        console.log("Retrieved LINE Profile:", profile);
                        setLineUserId(profile.userId);
                    }).catch(err => {
                        console.error("LIFF getProfile failed", err);
                        setLiffError("Failed to get LINE profile");
                    });
                } else {
                    console.warn("User is not logged in to LINE. If this is LIFF, you might need to call login().");
                }
            })
            .catch(err => {
                console.error("LIFF init failed:", err);
                setLiffError("LIFF initialization failed");
            });
    }, []);

    const login = () => liff.login();
    const logout = () => liff.logout();

    return { lineUserId, isLiffReady, liffError, login, logout };
};
