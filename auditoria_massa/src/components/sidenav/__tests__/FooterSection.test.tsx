
import { render, screen } from "@testing-library/react";
import { FooterSection } from "../FooterSection";
import userEvent from "@testing-library/user-event";

describe("FooterSection", () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders theme toggle and logout button", () => {
    render(<FooterSection onSignOut={mockSignOut} />);
    
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
  });

  it("calls onSignOut when logout button is clicked", async () => {
    render(<FooterSection onSignOut={mockSignOut} />);
    
    const logoutButton = screen.getByRole("button", { name: /sair/i });
    await userEvent.click(logoutButton);
    
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
