import { useContext } from "react";
import { UserContext } from "../contexts/user-context";

export function useUserContext() {
    return useContext(UserContext)
}