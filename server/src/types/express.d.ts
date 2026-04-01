import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

// declare: 어디간에 존재하고 있는 건데, 타입만 알려줄게
//    자바스크립트 런타임에는 이미 존재하는데, Typescript가 모르는 것을 알려주는 키워드
//    코드 생성하지 않고 타입 정보만 선언함.
// 예: 어떤 CDN 스크립트가 window.MY_LIB을 만들어둔 상황
//    declare const MY_LIB: { version: string };
//    → JS로 컴파일하면 아무것도 안 남음. 타입 정보만 존재

// namespace: 이름 충돌 방지용 그룹
//    관련된 타입들을 하나로 묶는다.
// namespace Express {
//   interface Request {}
//   interface Response {}
// }
//    사용: Express.Request, Express.Response

// module: 외부 패키지의 타입을 다룰 때
//    npm 패키지 같은 외부 모듈의 타입을 선언하거나 확장할 때 씀.
// 타입이 없는 npm 패키지에 타입 붙이기
// declare module 'some-untyped-library' {
//   export function doSomething(): void;
// }

// declare namespace: 이미 존재하는 네임스페이스의 타입을 알려줌
//    jQuery 같은 글로벌 라이브러리 타입 선언
// declare namespace jQuery {
//   function ajax(url: string): void;
// }

// declare module: 외부 모듈 타입 선언 or 확장
// 1. 타입 없는 패키지에 타입 붙이기
// declare module 'untyped-pkg' {
//   export function hello(): void;
// }
//
// 2. 기존 패키지 타입 확장 (module augmentation)
// declare module 'express' {
//   interface Request {
//     user?: JwtPayload;
//   }
// }

// declare global: 글로벌 스코프 확장
// 모듈 파일(import/export가 있는 파일) 안에서 글로벌 타입을 추가하고 싶을 때
// import 구문이 있는 순간 TypeScript가 이 파일을 모듈로 취급함.
// 모듈 안에서 글로벌 스코프에 접근하기 위해서는 반드시 declare global로 감싸야 함.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: JwtPayload;
//   }
// }
