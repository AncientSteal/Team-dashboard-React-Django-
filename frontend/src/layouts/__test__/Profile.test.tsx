import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import ProfilePage from "../Profile";
import { useAuth } from "../../hooks/useAuth";
import "@testing-library/jest-dom";

vi.mock("../../hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

const useAuthMock = vi.mocked(useAuth);

describe("Тестирование компонента ProfilePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("Должен корректно отображать данные авторизованного пользователя", () => {
        useAuthMock.mockReturnValue({
            user: {
                id: 1,
                email: "some@mail.com",
                username: "Gamma",
                position: "Developer",
                bio: "Frontend engineer with 5 years of experience.",
                avatar_url: "/avatar.jpg",
            },
            token: "123",
            isLoading: false,
            login: () =>({}),
            logout: () =>({}),
        });

        render(<ProfilePage />);

        expect(screen.getByText("Gamma")).toBeInTheDocument();
        expect(screen.getByText("Developer")).toBeInTheDocument();
        expect(screen.getByText("Frontend engineer with 5 years of experience.")).toBeInTheDocument();
    });

    test("Должен отображать дефолтные значения (заглушки), если у пользователя нет данных", () => {
        useAuthMock.mockReturnValue({ user: null } as Partial<ReturnType<typeof useAuth>> as any);
        render(<ProfilePage />);

        expect(screen.getByText("Guest")).toBeInTheDocument();
        expect(screen.getByText("Worker")).toBeInTheDocument();
        expect(screen.getByText(/No bio provided yet. Click "Edit Profile" to add some information about yourself!/i)).toBeInTheDocument();
    });

    test("Должен открывать модальное окно редактирования при клике на кнопку", () => {
         useAuthMock.mockReturnValue({ 
            user: {
                id: 1,
                email: "some@mail.com",
                username: "Guest",
                position: "Developer",
                avatar_url: "/avatar.jpg",
            },
            token: "123",
            isLoading: false,
            login: () =>({}),
            logout: () =>({}), 
        });

        render(<ProfilePage />);
        
        const editButton = screen.getByRole("button", { name: /Edit Profile/i });
        fireEvent.click(editButton);
        expect(screen.getByText("Edit Profile Info")).toBeInTheDocument();
    })
})