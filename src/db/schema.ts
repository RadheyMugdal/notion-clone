import { pgTable, uuid, timestamp, text, foreignKey, pgPolicy, jsonb, boolean, check, bigint, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'])


export const workspaces = pgTable("workspaces", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	workspaceOwner: uuid("workspace_owner").notNull(),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	logo: text(),
	bannerUrl: text("banner_url"),
});

export const files = pgTable("files", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id"),
	folderId: uuid("folder_id"),
}, (table) => {
	return {
		filesFolderIdFoldersIdFk: foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "files_folder_id_folders_id_fk"
		}).onDelete("cascade"),
		filesWorkspaceIdWorkspacesIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "files_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
	}
});

export const folders = pgTable("folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id"),
}, (table) => {
	return {
		foldersWorkspaceIdWorkspacesIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "folders_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
	}
});

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	paymentMethod: jsonb("payment_method"),
	email: text(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => {
	return {
		usersIdFkey: foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}),
		canUpdateOwnUserData: pgPolicy("Can update own user data.", { as: "permissive", for: "update", to: ["public"], using: sql`(( SELECT auth.uid() AS uid) = id)` }),
		everyoneCanViewOwnUserData: pgPolicy("Everyone can view own user data.", { as: "permissive", for: "select", to: ["public"] }),
	}
});

export const customers = pgTable("customers", {
	id: uuid().primaryKey().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
}, (table) => {
	return {
		customersIdFkey: foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "customers_id_fkey"
		}),
	}
});

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	active: boolean(),
	name: text(),
	description: text(),
	image: text(),
	metadata: jsonb(),
}, (table) => {
	return {
		allowPublicReadOnlyAccess: pgPolicy("Allow public read-only access.", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	}
});

export const prices = pgTable("prices", {
	id: text().primaryKey().notNull(),
	productId: text("product_id"),
	active: boolean(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text(),
	type: pricingType(),
	interval: pricingPlanInterval(),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb(),
}, (table) => {
	return {
		pricesProductIdFkey: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "prices_product_id_fkey"
		}),
		allowPublicReadOnlyAccess: pgPolicy("Allow public read-only access.", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
		pricesCurrencyCheck: check("prices_currency_check", sql`char_length(currency) = 3`),
	}
});

export const subscriptions = pgTable("subscriptions", {
	id: text().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	status: subscriptionStatus(),
	metadata: jsonb(),
	priceId: text("price_id"),
	quantity: integer(),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp({ withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
	cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
	trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
	trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
}, (table) => {
	return {
		subscriptionsPriceIdFkey: foreignKey({
			columns: [table.priceId],
			foreignColumns: [prices.id],
			name: "subscriptions_price_id_fkey"
		}),
		subscriptionsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "subscriptions_user_id_fkey"
		}),
		canOnlyViewOwnSubsData: pgPolicy("Can only view own subs data.", { as: "permissive", for: "select", to: ["public"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
	}
});
