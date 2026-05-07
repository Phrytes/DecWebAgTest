/**
 * MemberMapCache — re-export shim around `@decwebag/identity-resolver`.
 *
 * **2026-05-08:** the implementation lifted into the identity-resolver
 * substrate (Tasks V1 = rule-of-two consumer per
 * `Project Files/Stoop/migration-tasks-v1-lifts-2026-05-08.md`).
 * Storage path layout (`<root>members/<webid-encoded>.json`) is
 * preserved.
 */

export { MemberMapCache } from '@decwebag/identity-resolver';
