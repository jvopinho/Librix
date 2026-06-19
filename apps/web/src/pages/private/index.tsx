import { Route, Routes } from "react-router-dom";
import { HomePage } from "./home";

export function Private() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
        </Routes>
    )
}