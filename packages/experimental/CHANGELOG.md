# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [08-17-20] Pipeline with basic party-procesor.
- [08-17-20] Working message order.
- [08-16-20] Set/append mutations.
- [08-16-20] Pipeline.
- [08-15-20] Spacetime module and tests.
- [08-15-20] Inbound/outbound pipeline with optional loggers.
- [08-14-20] Database/Party/Item/Model structure.

## Next

### Critical

- Pipeline with feed-store-iterator (using party-processor).
- Pipeline and tests with party-procesor that manages admits feeds (using replay feed-store).

### Backlog

- Ensure streams are closed when objects are destroyed (on purpose or on error); error handling. Asserts vs Errors?
- Replay testing for feed-store-iterator.
- Initial state to bootstrap parties (from FeedStore metadata).
- Party metadata processing.
- Item models (system and user).
- Reactive components (Database, Party, Item, Model) with event propagation.
- Event handlers: global state to warn of leaks when system shuts down (show graph).

### Clean-up

- Pipeline logging/metrics.
- Consistent async functions (latch, trigger, etc.)
- WRN model/item formats.
