import React, { Children } from "react";
export default function FormContainer() {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md px-4">{Children}</div>
        </div>
    );
}
