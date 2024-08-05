DROP TABLE `tasky-v2_post`;--> statement-breakpoint
ALTER TABLE `tasky-v2_AuditLog` RENAME TO `tasky-v2_audit_log`;--> statement-breakpoint
ALTER TABLE `tasky-v2_Card` RENAME TO `tasky-v2_card`;--> statement-breakpoint
ALTER TABLE `tasky-v2_OrgLimit` RENAME TO `tasky-v2_org_limit`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `orgId` TO `org_id`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `entityId` TO `entity_id`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `entityType` TO `entity_type`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `entityTitle` TO `entity_title`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `userImage` TO `user_image`;--> statement-breakpoint
ALTER TABLE `tasky-v2_audit_log` RENAME COLUMN `userName` TO `user_name`;--> statement-breakpoint
ALTER TABLE `tasky-v2_board` RENAME COLUMN `imageThumbUrl` TO `image_thumb_url`;--> statement-breakpoint
ALTER TABLE `tasky-v2_board` RENAME COLUMN `imageFullUrl` TO `image_full_url`;--> statement-breakpoint
ALTER TABLE `tasky-v2_board` RENAME COLUMN `imageUserName` TO `image_user_name`;--> statement-breakpoint
ALTER TABLE `tasky-v2_board` RENAME COLUMN `imageLinkHTML` TO `image_link_html`;--> statement-breakpoint
ALTER TABLE `tasky-v2_card` RENAME COLUMN `listId` TO `list_id`;--> statement-breakpoint
ALTER TABLE `tasky-v2_list` RENAME COLUMN `boardId` TO `board_id`;--> statement-breakpoint
ALTER TABLE `tasky-v2_org_limit` RENAME COLUMN `orgId` TO `org_id`;--> statement-breakpoint
DROP INDEX IF EXISTS `tasky-v2_OrgLimit_orgId_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `listIdx`;--> statement-breakpoint
DROP INDEX IF EXISTS `boardIdx`;--> statement-breakpoint
CREATE UNIQUE INDEX `tasky-v2_org_limit_org_id_unique` ON `tasky-v2_org_limit` (`org_id`);--> statement-breakpoint
CREATE INDEX `listIdx` ON `tasky-v2_card` (`list_id`);--> statement-breakpoint
CREATE INDEX `boardIdx` ON `tasky-v2_list` (`board_id`);