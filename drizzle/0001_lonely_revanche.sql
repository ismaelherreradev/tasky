CREATE TABLE `tasky-v2_AuditLog` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`orgId` text NOT NULL,
	`action` text NOT NULL,
	`entityId` text NOT NULL,
	`entityType` text NOT NULL,
	`entityTitle` text NOT NULL,
	`userId` text NOT NULL,
	`userImage` text NOT NULL,
	`userName` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasky-v2_board` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`orgId` text NOT NULL,
	`title` text NOT NULL,
	`imageId` text NOT NULL,
	`imageThumbUrl` text NOT NULL,
	`imageFullUrl` text NOT NULL,
	`imageUserName` text NOT NULL,
	`imageLinkHTML` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasky-v2_Card` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`title` text NOT NULL,
	`order` integer NOT NULL,
	`description` text,
	`listId` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasky-v2_list` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`title` text NOT NULL,
	`order` integer NOT NULL,
	`boardId` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasky-v2_OrgLimit` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`orgId` text NOT NULL,
	`count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `listIdx` ON `tasky-v2_Card` (`listId`);--> statement-breakpoint
CREATE INDEX `boardIdx` ON `tasky-v2_list` (`boardId`);--> statement-breakpoint
CREATE UNIQUE INDEX `tasky-v2_OrgLimit_orgId_unique` ON `tasky-v2_OrgLimit` (`orgId`);