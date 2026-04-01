import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  // NOTE: CreateDateColumn은 기본적으로 타입이 timestamp -> timestamp without time zone
  //  timestamptz로 타입 설정을 해줘야 pg 드라이버가 값을 읽어올 때, time zone 정보를 확인해서 읽어옴
  //  설정 안하면 node.js process의 로컬 타임 존(KST)로 해석해서 값을 KST로 해석
  //  JavaScript가 Date 객체를 생성할 때 new Date('2026-03-29 13:27:00 KST') 이런식으로 만들게 된다.
  //  근데 JavaScript의 Date는 내부적으로 항상 UTC 기준 타임스탬프로 저장함. 그래서 13:27 KST는 내부적으로 04:27 UTC로 저장됨.
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
// NOTE
//  PostgreSQL은 timestamptz든 timestamp든 **내부적으로는 둘 다 UTC 기준 숫자(마이크로초)**로 저장.
//  timestamp (without time zone)
//    - 저장할 때: 시간대 변환 없이 그냥 숫자로 저장
//    - 읽을 때: 그냥 숫자를 문자열로 변환해서 반환. 13:27:00 (시간대 정보 없음)
//  timestamptz (with time zone)
//    - 저장할 때: 입력값을 UTC로 변환해서 저장
//    - 읽을 때: 저장된 UTC 값을 클라이언트의 세션 타임존에 맞게 변환해서 반환. 13:27:00+00 (시간대 정보 포함)
