import { Route, Routes } from "react-router-dom";
import { AdminUsersPage } from "./users";

export function Admin() {
    return (
        <Routes>
            <Route path="/users" element={<AdminUsersPage />} />
        </Routes>
    )
}