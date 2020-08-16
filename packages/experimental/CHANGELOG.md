# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Timeframe module and tests.
- Inbound/outbound pipeline with optional loggers.
- Database/Party/Item/Model structure.

## Next

- Iterator with Party procesor.
- Initial state to bootstrap parties (from FeedStore metadata).
- Set/append mutation.
- Replay testing for spacetime.

- Party metadata processing.
- Item models (system and user).
- Reactive components (Database, Party, Item, Model) with event propagation.
- Event handlers: global state to warn of leaks when system shuts down (show graph).
- Ensure streams are closed when objects are destroyed (on purpose or on error).
- Consistent async functions (latch, trigger, etc.)
- WRN model/item formats.

