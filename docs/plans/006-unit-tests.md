# Plan: Unit Tests
**Tarih:** 2026-03-29

## Context
AuthService ve ProjectService için unit test. Moq + InMemory DB kullanılacak.

## Testler
- AuthService: 7 test (register success/fail, login success/fail)
- ProjectService: 6 test (CRUD + ownership + admin bypass)
