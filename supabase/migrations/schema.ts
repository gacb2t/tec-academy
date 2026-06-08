import { pgTable, text, timestamp, pgPolicy, uuid, jsonb, foreignKey, date, unique, numeric, boolean, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userProfiles = pgTable("user_profiles", {
	userId: text("user_id").primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	department: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	role: text().default('colaborador'),
	team: text(),
});

export const jobApplications = pgTable("job_applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	team: text().notNull(),
	name: text().notNull(),
	email: text(),
	phone: text(),
	stage: text().default('Inscrição realizada').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Permitir atualizacao global", { as: "permissive", for: "update", to: ["public"], using: sql`true` }),
	pgPolicy("Permitir delecao global", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("Permitir inserção global", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Permitir leitura global", { as: "permissive", for: "select", to: ["public"] }),
]);

export const auditSettings = pgTable("audit_settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	settings: jsonb().default({}).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
}, (table) => [
	pgPolicy("Permitir tudo para todos em audit_settings", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
]);

export const audits = pgTable("audits", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	folderId: uuid("folder_id").notNull(),
	qualification: text().notNull(),
	audioFileName: text("audio_file_name"),
	status: text().default('pendente').notNull(),
	result: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	collaboratorId: text("collaborator_id"),
	collaboratorName: text("collaborator_name"),
	callDate: date("call_date"),
	clientPhone: text("client_phone"),
	audioUrl: text("audio_url"),
}, (table) => [
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [auditFolders.id],
			name: "audits_folder_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Permitir tudo para todos em audits", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
]);

export const auditFolders = pgTable("audit_folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	collaborators: jsonb().default([]).notNull(),
	managers: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
}, (table) => [
	pgPolicy("Permitir tudo para todos em audit_folders", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
]);

export const campaignComments = pgTable("campaign_comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id"),
	userId: text("user_id").notNull(),
	userName: text("user_name").notNull(),
	comment: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	likes: text().array().default([""]),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [campaigns.id],
			name: "campaign_comments_campaign_id_fkey"
		}).onDelete("cascade"),
]);

export const campaignInteractions = pgTable("campaign_interactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id"),
	userId: text("user_id").notNull(),
	interactionType: text("interaction_type").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [campaigns.id],
			name: "campaign_interactions_campaign_id_fkey"
		}).onDelete("cascade"),
	unique("campaign_interactions_campaign_id_user_id_interaction_type_key").on(table.campaignId, table.userId, table.interactionType),
]);

export const campaigns = pgTable("campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	content: text(),
	authorId: text("author_id").notNull(),
	authorName: text("author_name").notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	departments: text().array().default(["Todos"]),
	criteria: jsonb().default([]),
	superGoalType: text("super_goal_type"),
	superGoalValue: numeric("super_goal_value").default('0'),
	superGoalUnit: text("super_goal_unit"),
	progressValue: numeric("progress_value").default('0'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	isPinned: boolean("is_pinned").default(false),
	superGoalReward: numeric("super_goal_reward").default('0'),
	superGoalRewardType: text("super_goal_reward_type"),
	superGoalObjective: text("super_goal_objective"),
});

export const userWallets = pgTable("user_wallets", {
	userId: text("user_id").primaryKey().notNull(),
	balance: numeric().default('0'),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const marketplaceItems = pgTable("marketplace_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	type: text().notNull(),
	price: numeric().notNull(),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	isRecurring: boolean("is_recurring").default(false),
});

export const campaignSales = pgTable("campaign_sales", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id"),
	userId: text("user_id").notNull(),
	userName: text("user_name").notNull(),
	clientName: text("client_name").notNull(),
	productName: text("product_name").notNull(),
	saleValue: numeric("sale_value").notNull(),
	proofUrl: text("proof_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	saleId: text("sale_id"),
	cnpj: text(),
	quantity: integer().default(1),
	criteriaId: text("criteria_id"),
	status: text().default('pending'),
	rejectionReason: text("rejection_reason"),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [campaigns.id],
			name: "campaign_sales_campaign_id_fkey"
		}).onDelete("cascade"),
]);

export const marketplaceRedemptions = pgTable("marketplace_redemptions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	itemId: uuid("item_id"),
	pricePaid: numeric("price_paid").notNull(),
	status: text().default('pending'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [marketplaceItems.id],
			name: "marketplace_redemptions_item_id_fkey"
		}).onDelete("cascade"),
]);
