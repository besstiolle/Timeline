CREATE TABLE `timelines` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`key` text NOT NULL,
	`ownerKey` text NOT NULL,
	`writeKey` text NOT NULL,
	`readKey` text NOT NULL,
	`createdDateTime` integer NOT NULL,
	`json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `index_timeline_key` ON `timelines` (`key`);
