"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

function Provider({ children }) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState();

    useEffect(() => {
        if (user) {
            CreateNewUser();
        }
    }, [user]);

    const CreateNewUser = async () => {
        // Check if user already exists

        let { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", user?.primaryEmailAddress?.emailAddress);

        if (error) {
            console.log("Supabase Error:", error);
            return;
        }

        console.log("Users:", users);

        if (!users || users.length === 0) {
            const { data, error } = await supabase
                .from("users")
                .insert([
                    {
                        name: user?.fullName,
                        email: user?.primaryEmailAddress?.emailAddress,
                    },
                ])
                .select();

            if (error) {
                console.log("Insert User Error:", error);
                return;
            }

            console.log("New User:", data);

            if (data && data.length > 0) {
                setUserDetail(data[0]);
            }

            return;
        }

        setUserDetail(users[0]);
    };

    return (
        <>
            <UserDetailContext.Provider
                value={{ userDetail, setUserDetail }}
            >
                <div className="w-full">
                    {children}
                </div>
            </UserDetailContext.Provider>
        </>
    );
}

export default Provider;