import { relations } from "drizzle-orm/relations";
import { auditFolders, audits, campaigns, campaignComments, campaignInteractions, campaignSales, marketplaceItems, marketplaceRedemptions } from "./schema";

export const auditsRelations = relations(audits, ({one}) => ({
	auditFolder: one(auditFolders, {
		fields: [audits.folderId],
		references: [auditFolders.id]
	}),
}));

export const auditFoldersRelations = relations(auditFolders, ({many}) => ({
	audits: many(audits),
}));

export const campaignCommentsRelations = relations(campaignComments, ({one}) => ({
	campaign: one(campaigns, {
		fields: [campaignComments.campaignId],
		references: [campaigns.id]
	}),
}));

export const campaignsRelations = relations(campaigns, ({many}) => ({
	campaignComments: many(campaignComments),
	campaignInteractions: many(campaignInteractions),
	campaignSales: many(campaignSales),
}));

export const campaignInteractionsRelations = relations(campaignInteractions, ({one}) => ({
	campaign: one(campaigns, {
		fields: [campaignInteractions.campaignId],
		references: [campaigns.id]
	}),
}));

export const campaignSalesRelations = relations(campaignSales, ({one}) => ({
	campaign: one(campaigns, {
		fields: [campaignSales.campaignId],
		references: [campaigns.id]
	}),
}));

export const marketplaceRedemptionsRelations = relations(marketplaceRedemptions, ({one}) => ({
	marketplaceItem: one(marketplaceItems, {
		fields: [marketplaceRedemptions.itemId],
		references: [marketplaceItems.id]
	}),
}));

export const marketplaceItemsRelations = relations(marketplaceItems, ({many}) => ({
	marketplaceRedemptions: many(marketplaceRedemptions),
}));