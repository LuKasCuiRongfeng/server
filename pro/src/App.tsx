import React, { useState } from "react";

const App: React.FC<Record<string, unknown>> = () => {
    const [src, setSrc] = useState("");
    return (
        <div>
            <img src={src} alt="fuck" />
            <button
                onClick={() => {
                    fetch("http://localhost:12345/svg/condition_403.svg", {
                        method: "get",
                    })
                        .then(res => res.blob())
                        .then(res => {
                            setSrc(URL.createObjectURL(res));
                        })
                        .catch(err => console.error(err));
                }}
            >
                test
            </button>
        </div>
    );
};

export default App;
