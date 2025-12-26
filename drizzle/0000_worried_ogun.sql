CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text,
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogposts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content_mdx" text NOT NULL,
	"cover_image" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "blogposts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blogreads" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" varchar(36) NOT NULL,
	"fingerprint_id" varchar(64),
	"session_key" varchar(64) NOT NULL,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"max_scroll_percent" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "work_experience" (
	"id" text PRIMARY KEY NOT NULL,
	"period_start" varchar(10) NOT NULL,
	"period_end" varchar(10) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"fingerprint_id" varchar(64) PRIMARY KEY NOT NULL,
	"is_online" boolean DEFAULT true NOT NULL,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45),
	"country" varchar(2),
	"city" text,
	"latitude" numeric,
	"longitude" numeric,
	"current_path" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_technologies" (
	"portfolio_id" varchar(32) NOT NULL,
	"technology_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text NOT NULL,
	"difficulty" varchar(10) NOT NULL,
	"cover_image" text,
	"view_code_url" text,
	"live_demo_url" text,
	"status" varchar(20) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "portfolios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimoni" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(100),
	"company" varchar(150),
	"message" text NOT NULL,
	"avatar_url" varchar(255),
	"is_published" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "blog_slug_idx" ON "blogposts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_status_idx" ON "blogposts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_published_idx" ON "blogposts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blog_read_post_idx" ON "blogreads" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_read_fingerprint_idx" ON "blogreads" USING btree ("fingerprint_id");--> statement-breakpoint
CREATE INDEX "blog_read_session_idx" ON "blogreads" USING btree ("session_key");--> statement-breakpoint
CREATE INDEX "last_active_idx" ON "visitors" USING btree ("last_active_at");--> statement-breakpoint
CREATE INDEX "is_online_idx" ON "visitors" USING btree ("is_online");--> statement-breakpoint
CREATE INDEX "portfolio_tech_portfolio_idx" ON "portfolio_technologies" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "portfolio_tech_tech_idx" ON "portfolio_technologies" USING btree ("technology_id");--> statement-breakpoint
CREATE INDEX "portfolio_slug_idx" ON "portfolios" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "portfolio_status_idx" ON "portfolios" USING btree ("status");--> statement-breakpoint
CREATE INDEX "testimoni_idx" ON "testimoni" USING btree ("id");