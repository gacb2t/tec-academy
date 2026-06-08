import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

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
