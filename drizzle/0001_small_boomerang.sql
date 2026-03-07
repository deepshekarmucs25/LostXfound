ALTER TABLE "items" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "item_images" text[];--> statement-breakpoint
CREATE INDEX "items_images_idx" ON "items" USING btree ("item_images");