DROP INDEX "items_images_idx";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user';