
import { describe, it, expect, test } from "vitest";

import Login from "./containers/Login/Login";
import { getByText, render } from "@testing-library/react";

test("Login", () => {
    render(<><Login /></>)
    const nameLabel = getByText(/Forgot Password/i)
    expect(nameLabel).toBeInTheDocument();
    expect(true).toBeTruthy();
})