import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    pgTableCreator,
    text,
    timestamp,
    serial,
    varchar,
    integer,
    doublePrecision,
    pgEnum,
    unique
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `pg-drizzle_${name}`);

// ================= ENUMS =================

export const itemTypeEnum = pgEnum("item_type", ["lost", "found"]);

export const itemStatusEnum = pgEnum("item_status", [
    "active",
    "resolved",
]);

export const reportStatusEnum = pgEnum("report_status", [
    "pending",
    "reviewed",
    "rejected",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
    "message",
    "item_match",
    "item_resolved",
    "report_update",
]);

// ================= MERGED USER TABLE =================
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    avatar: text("avatar"),
    role: text("role").default("user"), // Added to fix Sidebar TypeScript error
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date())
        .notNull(),
});

// ================= AUTH TABLES =================

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// ================= APP TABLES =================

export const posts = createTable(
    "post",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        name: d.varchar({ length: 256 }),
        createdById: d
            .text()
            .notNull()
            .references(() => user.id),
        createdAt: d
            .timestamp({ withTimezone: true })
            .$defaultFn(() => new Date())
            .notNull(),
        updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    }),
    (t) => [
        index("created_by_idx").on(t.createdById),
        index("name_idx").on(t.name),
    ],
);

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
});

export const locations = pgTable("locations", {
    id: serial("id").primaryKey(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});

export const items = pgTable("items", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    
    // New Fields
    address: text("address"), 
    itemImages: text("item_images").array(), 
    
    type: itemTypeEnum("type").notNull(),
    status: itemStatusEnum("status").default("active"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
        .references(() => categories.id),
    locationId: integer("location_id")
        .references(() => locations.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
}, (t) => ({
    typeIdx: index("items_type_idx").on(t.type),
    statusIdx: index("items_status_idx").on(t.status),
    categoryIdx: index("items_category_idx").on(t.categoryId),
    // REMOVED imagesIdx to prevent error: index row requires 53680 bytes
}));

export const itemImages = pgTable("item_images", {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
        .notNull()
        .references(() => items.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
}, (t) => ({
    itemIdx: index("item_images_item_idx").on(t.itemId)
}));

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
        .notNull()
        .references(() => items.id, { onDelete: "cascade" }),
    ownerId: text("owner_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    finderId: text("finder_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("last_message_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    unq: unique().on(t.itemId, t.ownerId, t.finderId), 
}));

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id")
        .notNull()
        .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    message: text("message"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
}, (t) => ({
    convIdx: index("messages_conversation_idx").on(t.conversationId)
}));

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    message: text("message").notNull(),
    referenceId: integer("reference_id"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});

export const reports = pgTable("reports", {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
        .notNull()
        .references(() => items.id, { onDelete: "cascade" }),
    reportedBy: text("reported_by")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    details: text("details"),
    status: reportStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});

// ================= RELATIONS =================

export const userRelations = relations(user, ({ many }) => ({
    account: many(account),
    session: many(session),
    posts: many(posts),
    items: many(items),
    messages: many(messages),
    notifications: many(notifications),
    reports: many(reports),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
    user: one(user, {
        fields: [items.userId],
        references: [user.id],
    }),
    category: one(categories, {
        fields: [items.categoryId],
        references: [categories.id],
    }),
    location: one(locations, {
        fields: [items.locationId],
        references: [locations.id],
    }),
    images: many(itemImages),
    conversations: many(conversations),
    reports: many(reports),
}));

export const itemImagesRelations = relations(itemImages, ({ one }) => ({
    item: one(items, {
        fields: [itemImages.itemId],
        references: [items.id],
    }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
    item: one(items, {
        fields: [conversations.itemId],
        references: [items.id],
    }),
    owner: one(user, {
        fields: [conversations.ownerId],
        references: [user.id],
    }),
    finder: one(user, {
        fields: [conversations.finderId],
        references: [user.id],
    }),
    messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id],
    }),
    sender: one(user, {
        fields: [messages.senderId],
        references: [user.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(user, {
        fields: [notifications.userId],
        references: [user.id],
    }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
    item: one(items, {
        fields: [reports.itemId],
        references: [items.id],
    }),
    reporter: one(user, {
        fields: [reports.reportedBy],
        references: [user.id],
    }),
}));