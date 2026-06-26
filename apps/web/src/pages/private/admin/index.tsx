import { Route, Routes } from "react-router-dom";
import { AdminUsersPage } from "./users";
import { CreateBookPage } from "./books/create";

export function Admin() {
    return (
        <Routes>
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/books/new" element={<CreateBookPage />} />
        </Routes>
    )
}