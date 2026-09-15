"use client";

import { supabase } from "@/services/supabase";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import DisplayResult from "./_components/DisplayResult";

function SearchQueryResult() {
    const { LibId } = useParams();
    const [searchInputRecord, setSearchInputRecord] = useState();

    useEffect(() => {
        if (LibId) {
            GetSearchQueryRecord();
        }
    }, [LibId]);

    const GetSearchQueryRecord = async () => {
        let { data: Library, error } = await supabase
            .from("Library")
            .select("*,Chats(*)")
            .eq("LibId", LibId);

        if (error) {
            console.log("Supabase Error:", error);
            return;
        }

        if (!Library || Library.length === 0) {
            console.log("No Library record found for LibId:", LibId);
            return;
        }

        console.log("Library Record:", Library[0]);

        setSearchInputRecord(Library[0]);
    };

    return (
        <div className="min-h-screen galaxy-bg relative overflow-hidden">
            {/* Animated stars background */}
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>

            {/* Header with website name */}
            <div className="text-center pt-8 pb-4 relative z-10">
                <h1 className="text-5xl font-bold text-white mb-2 animate-pulse drop-shadow-lg">
                    Askify
                </h1>

                <p className="text-indigo-100 text-lg font-medium">
                    Your intelligent search companion
                </p>
            </div>

            <div className="relative z-10">
                <Header searchInputRecord={searchInputRecord} />
            </div>

            <div className="px-4 md:px-20 lg:px-36 xl:px-56 mt-8 relative z-10">
                <DisplayResult searchInputRecord={searchInputRecord} />
            </div>

            <style jsx>{`
                .galaxy-bg {
                    background: linear-gradient(
                        125deg,
                        #0f0c29,
                        #302b63,
                        #24243e
                    );
                    position: relative;
                }

                /* Enhanced text visibility */
                :global(.text-gray-600),
                :global(.text-gray-700) {
                    color: #e5e7eb !important;
                }

                :global(.bg-accent) {
                    background-color: rgba(
                        99,
                        102,
                        241,
                        0.3
                    ) !important;
                }

                :global(.border-gray-200) {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }

                /* Stars animation */
                .stars,
                .stars2,
                .stars3 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .stars:before,
                .stars2:before,
                .stars3:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;

                    background-image:
                        radial-gradient(
                            2px 2px at 20px 30px,
                            rgba(238, 238, 238, 0.8),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 40px 70px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 90px 40px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 130px 80px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 160px 30px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        );

                    background-repeat: repeat;
                    background-size: 200px 100px;
                    animation: stars 30s linear infinite;
                }

                .stars2:before {
                    background-image:
                        radial-gradient(
                            2px 2px at 10px 10px,
                            rgba(238, 238, 238, 0.8),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 30px 50px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 70px 20px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 110px 60px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 140px 10px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        );

                    animation: stars 40s linear infinite;
                    opacity: 0.7;
                }

                .stars3:before {
                    background-image:
                        radial-gradient(
                            2px 2px at 5px 5px,
                            rgba(238, 238, 238, 0.8),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 25px 35px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 65px 15px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        ),
                        radial-gradient(
                            1px 1px at 105px 45px,
                            rgba(255, 255, 255, 0.9),
                            transparent
                        ),
                        radial-gradient(
                            2px 2px at 135px 5px,
                            rgba(221, 221, 221, 0.7),
                            transparent
                        );

                    animation: stars 50s linear infinite;
                    opacity: 0.5;
                }

                @keyframes stars {
                    from {
                        transform: translateY(0px);
                    }

                    to {
                        transform: translateY(-100px);
                    }
                }
            `}</style>
        </div>
    );
}

export default SearchQueryResult;