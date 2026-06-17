import { Route, Routes } from "react-router-dom";
import { ActivateAccount } from "./activate";
import { InvalidInvitation } from "./activate/invalid/invalid";

export function User() {
    return (
        <Routes>
            <Route path="/activate" element={<ActivateAccount />} />
            <Route path="/activate/invalid" element={<InvalidInvitation />} />
        </Routes>
    )
}