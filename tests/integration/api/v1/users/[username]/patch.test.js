import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user";
import password from "models/password";

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
          }),
        },
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

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/user2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user1",
          }),
        },
      );
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

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@email.com",
          }),
        },
      );
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

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/dj",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "DJ",
          }),
        },
      );
      expect(patchResponse.status).toBe(200);

      //const responseBody = await patchResponse.json();
    });

    test("With unique `username`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique.user.1",
          email: "unique.user.1@email.com",
          password: "password123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/unique.user.1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "unique.user.2",
          }),
        },
      );
      expect(patchResponse.status).toBe(200);

      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique.user.2",
        email: "unique.user.1@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique `email`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique.email.1",
          email: "unique.email.1@email.com",
          password: "password123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/unique.email.1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "unique.email.2@email.com",
          }),
        },
      );
      expect(patchResponse.status).toBe(200);

      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique.email.1",
        email: "unique.email.2@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new `password`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "new.password.1",
          email: "new.password.1@email.com",
          password: "old password",
        }),
      });
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/new.password.1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "new password",
          }),
        },
      );
      expect(patchResponse.status).toBe(200);

      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDb = await user.findOneByUserName(responseBody.username);
      const correctPasswordMatch = await password.compare(
        "new password",
        userInDb.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "old password",
        userInDb.password,
      );
      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
