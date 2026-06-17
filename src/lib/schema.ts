import {
  pgTable, uuid, text, integer, boolean,
  timestamp, date, pgEnum
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Enums ────────────────────────────────────────────────────
export const checkinStatusEnum = pgEnum('checkin_status', [
  'pending', 'verified', 'checked_in', 'checked_out',
])

export const idTypeEnum = pgEnum('id_type', [
  'aadhaar', 'passport', 'driving_licence', 'voter_id', 'pan',
])

// ── checkins ─────────────────────────────────────────────────
export const checkins = pgTable('checkins', {
  id:              uuid('id').primaryKey().defaultRandom(),
  // Personal
  firstName:       text('first_name').notNull(),
  lastName:        text('last_name').notNull(),
  email:           text('email').notNull(),
  phone:           text('phone').notNull(),
  city:            text('city'),
  state:           text('state'),
  // Stay
  checkinDate:     date('checkin_date').notNull(),
  checkoutDate:    date('checkout_date').notNull(),
  airbnbBookingId: text('airbnb_booking_id').notNull(),
  purposeOfVisit:  text('purpose_of_visit'),
  guestCount:      integer('guest_count').notNull().default(1),
  specialRequests: text('special_requests'),
  // Admin
  status:          checkinStatusEnum('status').notNull().default('pending'),
  submittedAt:     timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:       timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── guest_ids ─────────────────────────────────────────────────
export const guestIds = pgTable('guest_ids', {
  id:           uuid('id').primaryKey().defaultRandom(),
  checkinId:    uuid('checkin_id').notNull().references(() => checkins.id, { onDelete: 'cascade' }),
  guestIndex:   integer('guest_index').notNull(),
  isPrimary:    boolean('is_primary').notNull().default(false),
  guestName:    text('guest_name').notNull(),
  idType:       idTypeEnum('id_type').notNull(),
  idNumber:     text('id_number').notNull(),
  idFrontUrl:   text('id_front_url'),
  idBackUrl:    text('id_back_url'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Relations ─────────────────────────────────────────────────
export const checkinsRelations = relations(checkins, ({ many }) => ({
  guestIds: many(guestIds),
}))

export const guestIdsRelations = relations(guestIds, ({ one }) => ({
  checkin: one(checkins, { fields: [guestIds.checkinId], references: [checkins.id] }),
}))

// ── Types ─────────────────────────────────────────────────────
export type Checkin = typeof checkins.$inferSelect
export type NewCheckin = typeof checkins.$inferInsert
export type GuestId = typeof guestIds.$inferSelect
export type NewGuestId = typeof guestIds.$inferInsert
