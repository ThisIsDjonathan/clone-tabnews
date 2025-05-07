import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent user", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/unexistentUser",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "New Name",
          })
        }
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

    test("With duplicated `username`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@email.com",
          password: "password123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@email.com",
          password: "password123",
        }),
      });
      expect(user2Response.status).toBe(201);

      const patchResponse = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(patchResponse.status).toBe(400);

      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        message: `Username "user1" is already in use.`,
        action: `Try again with a different username.`,
        name: "ValidationError",
        status_code: 400,
      });
    });

    test("With duplicated `email`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@email.com",
          password: "password123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@email.com",
          password: "password123",
        }),
      });
      expect(user2Response.status).toBe(201);

      const patchResponse = await fetch("http://localhost:3000/api/v1/users/email2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email1@email.com",
        }),
      });
      expect(patchResponse.status).toBe(400);

      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        message: `Email "email1@email.com" is already in use.`,
        action: `Try again with a different email.`,
        name: "ValidationError",
        status_code: 400,
      });
    });

    test("Updating username case", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "dj",
          email: "dj@email.com",
          password: "password123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch("http://localhost:3000/api/v1/users/dj", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "DJ",
        }),
      });
      expect(patchResponse.status).toBe(200);

      //const responseBody = await patchResponse.json();
    });
  });
});
