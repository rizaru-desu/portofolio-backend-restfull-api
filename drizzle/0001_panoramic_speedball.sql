CREATE TABLE "technologies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text
);
--> statement-breakpoint
ALTER TABLE "portfolio_technologies" ALTER COLUMN "portfolio_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "portfolio_technologies" ALTER COLUMN "technology_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "portfolio_technologies" ADD CONSTRAINT "portfolio_technologies_portfolio_id_technology_id_pk" PRIMARY KEY("portfolio_id","technology_id");--> statement-breakpoint
ALTER TABLE "portfolio_technologies" ADD CONSTRAINT "portfolio_technologies_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_technologies" ADD CONSTRAINT "portfolio_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;