"use client";
import React from "react";
import Processing from "../assets/icons/svg/Processing";

export default function ChatApp() {
    return (
        <div className="grid place-content-center h-[100dvh] bg-[#f0f0f0] dark:bg-zinc-900 font-sans text-gray-900 dark:text-zinc-100">
            <main className="w-[400px] max-w-full h-[70vh] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded shadow p-2 mb-4 overflow-y-auto scroll-smooth">
                <ul className="flex flex-col list-none p-0">
                    <li className="flex flex-col my-1 p-2 text-center justify-center h-full items-center mt-[50%]">
                        <Processing />
                        <h4 className="text-gray-700 dark:text-zinc-300 mb-2">
                            Loading...
                        </h4>
                        <h5 className="font-normal m-0 text-[10px] opacity-40">
                            This may take a while. Please be patient.
                        </h5>
                    </li>
                </ul>
            </main>

            <form className="flex">
                <input
                    placeholder="Type your message here..."
                    className="rounded-full flex-grow border border-gray-300 dark:border-zinc-600 bg-white dark:bg-gray-700 p-2 mr-2 text-gray-900 dark:text-zinc-100"
                />
                <button
                    disabled
                    className="bg-[#0099ff] dark:bg-zinc-600 border-0 text-white rounded-md cursor-pointer p-2 transition duration-300 ease hover:bg-[#0068ad] dark:hover:bg-zinc-700 disabled:bg-gray-300 disabled:opacity-60 disabled:pointer-events-none"
                >
                    Enviar
                </button>
            </form>

            <small className="text-[10px] text-gray-500 dark:text-zinc-400 fixed bottom-2.5 left-0 right-0 mx-auto w-[400px]">
                &nbsp;
            </small>
        </div>
    );
}
