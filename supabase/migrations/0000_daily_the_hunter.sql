-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"department" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"role" text DEFAULT 'colaborador',
	"team" text
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"stage" text DEFAULT 'Inscrição realizada' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now())
);
--> statement-breakpoint
ALTER TABLE "audit_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folder_id" uuid NOT NULL,
	"qualification" text NOT NULL,
	"audio_file_name" text,
	"status" text DEFAULT 'pendente' NOT NULL,
	"result" jsonb,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
	"completed_at" timestamp with time zone,
	"collaborator_id" text,
	"collaborator_name" text,
	"call_date" date,
	"client_phone" text,
	"audio_url" text
);
--> statement-breakpoint
ALTER TABLE "audits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"collaborators" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"managers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now())
);
--> statement-breakpoint
ALTER TABLE "audit_folders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "campaign_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"likes" text[] DEFAULT '{""}'
);
--> statement-breakpoint
CREATE TABLE "campaign_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"user_id" text NOT NULL,
	"interaction_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campaign_interactions_campaign_id_user_id_interaction_type_key" UNIQUE("campaign_id","user_id","interaction_type")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"departments" text[] DEFAULT '{"Todos"}',
	"criteria" jsonb DEFAULT '[]'::jsonb,
	"super_goal_type" text,
	"super_goal_value" numeric DEFAULT '0',
	"super_goal_unit" text,
	"progress_value" numeric DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_pinned" boolean DEFAULT false,
	"super_goal_reward" numeric DEFAULT '0',
	"super_goal_reward_type" text,
	"super_goal_objective" text
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"user_id" text PRIMARY KEY NOT NULL,
	"balance" numeric DEFAULT '0',
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "marketplace_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"price" numeric NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_recurring" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "campaign_sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"client_name" text NOT NULL,
	"product_name" text NOT NULL,
	"sale_value" numeric NOT NULL,
	"proof_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"sale_id" text,
	"cnpj" text,
	"quantity" integer DEFAULT 1,
	"criteria_id" text,
	"status" text DEFAULT 'pending',
	"rejection_reason" text
);
--> statement-breakpoint
CREATE TABLE "marketplace_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"item_id" uuid,
	"price_paid" numeric NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."audit_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_comments" ADD CONSTRAINT "campaign_comments_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_interactions" ADD CONSTRAINT "campaign_interactions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_sales" ADD CONSTRAINT "campaign_sales_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_redemptions" ADD CONSTRAINT "marketplace_redemptions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."marketplace_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Permitir atualizacao global" ON "job_applications" AS PERMISSIVE FOR UPDATE TO public USING (true);--> statement-breakpoint
CREATE POLICY "Permitir delecao global" ON "job_applications" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Permitir inserção global" ON "job_applications" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Permitir leitura global" ON "job_applications" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Permitir tudo para todos em audit_settings" ON "audit_settings" AS PERMISSIVE FOR ALL TO public USING (true);--> statement-breakpoint
CREATE POLICY "Permitir tudo para todos em audits" ON "audits" AS PERMISSIVE FOR ALL TO public USING (true);--> statement-breakpoint
CREATE POLICY "Permitir tudo para todos em audit_folders" ON "audit_folders" AS PERMISSIVE FOR ALL TO public USING (true);
*/