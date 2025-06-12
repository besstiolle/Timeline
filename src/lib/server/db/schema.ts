import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core"


export const timelines = sqliteTable("timelines", {
	id: integer().primaryKey({ autoIncrement: true }),
	key: text().notNull(),
	ownerKey: text().notNull(),
	writeKey: text().notNull(),
	readKey: text().notNull(),
	createdDateTime: integer().notNull(),
	json: text().notNull(),
},
(table) => [
	index("index_timeline_key").on(table.key),
]);

