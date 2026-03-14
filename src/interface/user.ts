export type User = {
    id: number;
    username: string;
    email: string;
    mobile: string;
    first_name: string;
    last_name: string;
    role: "admin" | "teacher";
    is_active: boolean;
    is_staff: boolean;
    active_at: string | null;
};

export type newUser = {
    username: string;
    password: string;
    email: string;
    mobile: string;
    firstname: string;
    lastname: string;
    role: string;
}