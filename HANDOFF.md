# HANDOFF

> Update this file at the end of each session.
> Record what was done and what comes next.

Last updated: 2026-05-12

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
- Response DTO implementation
    - `servers.service.ts`, `channels.service.ts` 모두 `plainToInstance`로 DTO 반환
    - `@Expose()` 데코레이터 없이 DTO에 노출할 필드만 정의
    - `ClassSerializerInterceptor` 글로벌 등록 제거
    - `SerializeInterceptor` 커스텀 인터셉터 방식 채택하지 않음
    - 결정 근거: 서비스가 DTO 반환 책임을 가져야 레이어 경계가 명확하고 DDD 전환 시 유리
- Unit tests — ChannelsService (all passing)
- Unit tests — AuthService register (all passing)
    - `jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }))` 팩토리 방식으로 bcrypt 모킹
    - bcrypt mock 호출 시 `(bcrypt.hash as jest.Mock)` 타입 단언 사용

### Next Task

**AuthService 단위 테스트 — login**

### After That (in order)

1. Auth integration tests
2. Selective E2E tests

---

## Deferred

- Swagger detailed documentation (`description`, `@ApiResponse`, etc.) — after Phase 1 stabilizes
- Guard-based authorization refactor (owner/member access control) — future improvement
- OAuth (Google, GitHub, Kakao, Naver) — not a Phase 1 requirement
- Custom repository pattern — only if complex query encapsulation becomes necessary (YAGNI)
