# HANDOFF

> Update this file at the end of each session.
> Record what was done and what comes next.

Last updated: 2026-05-03

---

## Current Status: Phase 1

### Completed

- Auth (register/login, JWT Guard — implemented without Passport.js)
- Server CRUD + invite code join (`crypto.randomUUID()`)
- Channel CRUD (nested routing: `/servers/:serverId/channels`)
- WebSocket chat (Socket.IO, HTML test file in `request/`)
- Custom exception architecture
    - `BaseException` (extends HttpException, holds errorCode + message)
    - `ServerException` / `ChannelException` static factory pattern
    - `HttpExceptionFilter` — `@Catch(HttpException)`, branches on `instanceof BaseException`
    - `AllExceptionFilter` — `@Catch()` catch-all, returns fixed 500
    - Both filters registered in `main.ts`
- Unit tests — ServersService (all passing)
- Exception handling — applied in `servers.service.ts` and `channels.service.ts`
- Swagger (`@nestjs/swagger`) added

### Next Task

**Response DTO implementation** (top priority)

Decided approach: custom `SerializeInterceptor` + `@Serialize(DtoClass)` decorator + `plainToInstance` + `@Expose()`

Implementation order:
1. `common/interceptors/serialize.interceptor.ts` — calls `plainToInstance`
2. `@Serialize()` custom decorator
3. `ServerResponseDto` — only `@Expose()` fields included in response
4. `ChannelResponseDto`
5. Apply `@Serialize()` on controllers
6. Services continue returning entities as-is (transformation is the interceptor's responsibility)

### After That (in order)

1. ChannelsService unit tests
2. AuthService unit tests
3. Auth integration tests
4. Selective E2E tests

---

## Deferred

- Swagger detailed documentation (`description`, `@ApiResponse`, etc.) — after Phase 1 stabilizes
- Guard-based authorization refactor (owner/member access control) — future improvement
- OAuth (Google, GitHub, Kakao, Naver) — not a Phase 1 requirement
- Custom repository pattern — only if complex query encapsulation becomes necessary (YAGNI)