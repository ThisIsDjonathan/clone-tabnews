import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "SameCase",
        email: "same.case@email.com",
        password: "password123",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/SameCase",
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "SameCase",
        email: "same.case@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "OtherCase",
        email: "other.case@email.com",
        password: "password123",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/othercase",
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "OtherCase",
        email: "other.case@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("Not found", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/unexistentUser",
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found.",
        action: "Try again with a different username.",
        status_code: 404,
      });
    });
  });
});
