import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  team: text('team').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  stage: text('stage').notNull().default('Inscrição realizada'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const modules = pgTable('modules', {
  id: text('id').primaryKey(), // Usando text para manter compatibilidade com os IDs atuais "mod-sistemas"
  title: text('title').notNull(),
  icon: text('icon').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const materials = pgTable('materials', {
  id: text('id').primaryKey(), // Usando text para manter compatibilidade "mat-sistemas"
  moduleId: text('module_id').references(() => modules.id).notNull(),
  title: text('title').notNull(),
  embedSrc: text('embed_src').notNull(),
  type: text('type').notNull().default('presentation'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const webhooks = pgTable('webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  event: text('event').notNull(),
  isActive: integer('is_active').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
