"use client";
import { useEffect, useRef, useState } from "react";
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";
import Processing from "../assets/icons/svg/Processing";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const SELECTED_MODEL = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";

export default function ChatApp() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState("");
    const containerRef = useRef<HTMLElement>(null);
    const [engine, setEngine] = useState<any>(null);

    useEffect(() => {
        const initEngine = async () => {
            const engine = await CreateWebWorkerMLCEngine(
                new Worker(new URL("../utils/worker", import.meta.url), {
                    type: "module",
                }),
                SELECTED_MODEL,
                {
                    initProgressCallback: (info) => {
                        setInfo(info.text);
                        if (info.progress === 1) {
                            setIsLoading(false);
                            addMessage(
                                "Hi! I'm a ChatGPT that runs completely in your browser. How can I help you today?",
                                "assistant"
                            );
                        }
                    },
                }
            );
            setEngine(engine);
        };
        initEngine();
    }, []);

    const addMessage = (content: string, role: "user" | "assistant") => {
        setMessages((prev) => [...prev, { role, content }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !engine) return;

        const messageText = input.trim();
        setInput("");
        addMessage(messageText, "user");
        setIsLoading(true);

        try {
            const chunks = await engine.chat.completions.create({
                messages: [...messages, { role: "user", content: messageText }],
                stream: true,
            });

            let reply = "";
            for await (const chunk of chunks) {
                const content = chunk.choices[0]?.delta?.content ?? "";
                reply += content;
                setMessages((prev) => {
                    const newMessages = [...prev];
                    if (
                        newMessages[newMessages.length - 1]?.role ===
                        "assistant"
                    ) {
                        newMessages[newMessages.length - 1].content = reply;
                    } else {
                        newMessages.push({ role: "assistant", content: reply });
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="grid place-content-center h-[100dvh] bg-[#f0f0f0] dark:bg-zinc-900 font-sans text-gray-900 dark:text-zinc-100">
            <main
                ref={containerRef}
                className="w-[400px] max-w-full h-[70vh] bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded shadow p-2 mb-4 overflow-y-auto scroll-smooth"
            >
                <ul className="flex flex-col list-none p-0">
                    {isLoading && messages.length === 0 ? (
                        <li className="flex flex-col my-1 p-2 text-center justify-center h-full items-center mt-[50%]">
                            <Processing />
                            <h4 className="text-gray-700 dark:text-zinc-300 mb-2">
                                Loading...
                            </h4>
                            <h5 className="font-normal m-0 text-[10px] opacity-40">
                                This may take a while. Please be patient.
                            </h5>
                        </li>
                    ) : (
                        messages.map((message, index) => (
                            <li
                                key={index}
                                className={`message flex flex-col my-1 p-2 ${
                                    message.role === "assistant"
                                        ? "bot"
                                        : "user"
                                }`}
                            >
                                <span className="text-xs text-gray-500 mb-1">
                                    {message.role === "assistant"
                                        ? "GPT"
                                        : "You"}
                                </span>
                                <p className="m-0">{message.content}</p>
                            </li>
                        ))
                    )}
                </ul>
            </main>

            <form onSubmit={handleSubmit} className="flex">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="rounded-full flex-grow border border-gray-300 dark:border-zinc-600 bg-white dark:bg-gray-700 p-2 mr-2 text-gray-900 dark:text-zinc-100"
                />
                <button
                    disabled={isLoading || !engine}
                    className="bg-[#0099ff] dark:bg-zinc-600 border-0 text-white rounded-md cursor-pointer p-2 transition duration-300 ease hover:bg-[#0068ad] dark:hover:bg-zinc-700 disabled:bg-gray-300 disabled:opacity-60 disabled:pointer-events-none"
                >
                    Send
                </button>
            </form>

            <small className="text-[10px] text-gray-500 dark:text-zinc-400 fixed bottom-2.5 left-0 right-0 mx-auto w-[400px]">
                {info}
            </small>
        </div>
    );
}
