# Backend API Requirements - KickerGPT Mobile & Web

## 📋 Overview

This document outlines ALL backend requirements for KickerGPT, including:

- ✅ **What you may already have** (existing web implementation)
- ❌ **What you MUST add** (mobile app requirements)
- 🗑️ **What was removed** (addon credit purchases)

---

## ⚠️ IMPORTANT: What Changed

### 🗑️ REMOVED (No Longer Needed)

- ❌ `POST /subscriptions/addon-purchase` - One-time credit packs (10, 25, 50 credits)
- ❌ `POST /subscriptions/addon-purchase-verify` - Addon verification
- ❌ `POST /purchases/verify-mobile` - One-time IAP verification
- ❌ `POST /purchases/sync` - Sync one-time purchases
- ❌ `addonCreditsRemaining` field - From subscription response

**Why removed?** Simplified monetization - now only subscriptions + ad rewards.

### ✅ NEW (Mobile App Needs)

- ✅ `POST /ads/reward` - Grant credits for watching ads (OPTIONAL)
- ✅ Update `GET /subscriptions/usage` - Include ad credits
- ✅ Database schema changes

---

## 🎯 Current Monetization Model

### FREE Tier

- 10 prompts per month
- Can watch ads for extra prompts (mobile only)

### PRO Tier (KickerGPT Pro)

- 100 prompts per month
- Ad-free experience
- Auto-renewal
- **Web:** $7/month via Stripe (non-Nigerian users)

---

## 1. Update GET `/subscriptions/me` (CRITICAL - UPDATE EXISTING)

**Current Behavior:** Probably only checks Stripe subscriptions

**Required Behavior:** Check Stripe subscriptions

**Logic:**

```
1. Check Stripe subscription:
   - Query Stripe API for active subscription
   - If active
   - THEN return: plan = 'PRO', source = 'stripe'

2. Default:
   - return: plan = 'FREE', source = null
```

**Response Format:**

```json
{
  "plan": "PRO",
  "status": "ACTIVE",
  "source": "stripe",
  "expirationDate": "2024-12-31T23:59:59Z",
  "autoRenew": true,
  "productId": "monthly",
  "currentPeriodEnd": "2024-12-31T23:59:59Z"
}
```

**Why This Matters:**

- User can subscribe on web (Stripe)
- Grants PRO status
- User gets PRO access on web platform
- Frontend needs to know source to show correct "Manage Subscription" link

---

## 2. Update GET `/subscriptions/usage` (UPDATE EXISTING)

**Current Response (probably):**

```json
{
  "monthlyAllowance": 100,
  "monthlyUsed": 25,
  "monthlyRemaining": 75
}
```

**Required Response:**

```json
{
  "monthlyAllowance": 100,
  "monthlyUsed": 25,
  "monthlyRemaining": 75,
  "adCreditsRemaining": 15
}
```

**New Field:**

- `adCreditsRemaining`: Credits earned from watching ads (mobile only)

**Credit Consumption Priority:**

```
1. Use ad credits first (adCreditsRemaining)
2. Then use monthly allowance (monthlyRemaining)
```

---

## 4. Ad Rewards Endpoint (OPTIONAL - NEW)

### POST `/ads/reward`

**Purpose:** Grant credits when user watches a rewarded video ad

**Only implement if:** You want mobile users to watch ads for extra prompts

**Request:**

```json
{
  "adType": "rewarded_video",
  "adUnitId": "ca-app-pub-xxxxx/xxxxx",
  "rewardAmount": 5
}
```

**Response:**

```json
{
  "success": true,
  "creditsGranted": 5,
  "adCreditsRemaining": 20,
  "nextAdAvailableAt": "2024-01-15T14:30:00Z"
}
```

**Implementation:**

1. **Verify user is authenticated**
2. **Check ad cooldown** - Prevent abuse
   - Max 10 ads per day
   - 30 minutes cooldown between ads
3. **Grant credits** - Add to user's `ad_credits_remaining`
4. **Store ad event** - For analytics and fraud detection
5. **Return new balance**

**Database Changes:**

```sql
ALTER TABLE users ADD COLUMN ad_credits_remaining INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_ad_watched_at TIMESTAMP DEFAULT NULL;
ALTER TABLE users ADD COLUMN ads_watched_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN ads_reset_date DATE DEFAULT CURRENT_DATE;

CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ad_type VARCHAR(50) NOT NULL,
  credits_granted INTEGER NOT NULL,
  watched_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_ad_rewards (user_id),
  INDEX idx_watched_at (watched_at)
);
```

**Rate Limiting:**

- Max 10 ads per day per user
- 30 minutes cooldown between ads
- Each ad = 5 prompts
- Reset daily counter at midnight UTC

**Fraud Prevention:**

- Track IP address
- Track device ID
- Flag suspicious patterns (too many ads, too fast)

---

## 5. Database Schema Changes (REQUIRED)

### Add to Users Table:

```sql
-- Subscription tracking
ALTER TABLE users ADD COLUMN subscription_source VARCHAR(50) DEFAULT NULL;
  -- Values: 'stripe'

ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'INACTIVE';
  -- Values: 'ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELLED'

ALTER TABLE users ADD COLUMN subscription_expiration_date TIMESTAMP DEFAULT NULL;
  -- When subscription expires

ALTER TABLE users ADD COLUMN subscription_auto_renew BOOLEAN DEFAULT true;
  -- Will it auto-renew?

ALTER TABLE users ADD COLUMN subscription_product_id VARCHAR(100) DEFAULT NULL;
  -- Product identifier (e.g., 'monthly')

-- Monthly prompt allowance (10 for FREE, 100 for PRO)
ALTER TABLE users ADD COLUMN monthly_allowance INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN monthly_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monthly_remaining INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN last_monthly_reset TIMESTAMP DEFAULT NULL;

-- Ad credits (OPTIONAL - only if using ad rewards)
ALTER TABLE users ADD COLUMN ad_credits_remaining INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_ad_watched_at TIMESTAMP DEFAULT NULL;
ALTER TABLE users ADD COLUMN ads_watched_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN ads_reset_date DATE DEFAULT CURRENT_DATE;

-- Indexes for performance
CREATE INDEX idx_subscription_source ON users(subscription_source);
CREATE INDEX idx_subscription_status ON users(subscription_status);
CREATE INDEX idx_subscription_expiration ON users(subscription_expiration_date);
```

### Create Ad Rewards Table (OPTIONAL):

```sql
CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ad_type VARCHAR(50) NOT NULL,
  ad_unit_id VARCHAR(255),
  credits_granted INTEGER NOT NULL,
  ip_address INET,
  device_id VARCHAR(255),
  watched_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_ad_rewards (user_id),
  INDEX idx_watched_at (watched_at)
);

CREATE INDEX idx_ad_rewards_user_date ON ad_rewards(user_id, watched_at);
CREATE INDEX idx_ad_rewards_device ON ad_rewards(device_id);
```

---

## 6. Environment Variables

Add any required environment variables for your backend configuration.

---

## 7. KickerGPT Pro Subscription Details

**What KickerGPT Pro Gives Users:**

- 100 AI prompts per month (vs 10 for free tier)
- Ad-free experience (frontend checks `isPro` status)
- Auto-renewal (monthly billing)
- Access on ALL platforms (web + mobile)

**Pricing:**

- Web (Stripe): $7/month (non-Nigerian users)

**Product Configuration:**

- Product ID: `monthly`

---

## 📊 Implementation Priority

### ✅ MUST IMPLEMENT (Mobile App Won't Work Without These):

1. **Update `GET /subscriptions/me`**
   - Check Stripe subscriptions
   - Return subscription status

2. **Database schema changes**
   - Add subscription tracking columns

**Estimated Time: ~4 hours**

### 🎁 OPTIONAL (For Ad-Based Credits):

4. **Ad rewards endpoint** (`POST /ads/reward`)
   - Grant credits when user watches ads
   - Add rate limiting

5. **Update `GET /subscriptions/usage`**
   - Include `adCreditsRemaining`

6. **Database changes for ads**
   - Add ad credit columns
   - Create `ad_rewards` table

**Estimated Time: ~2 hours**

---

## 🔄 Migration Strategy

### If You Already Have Stripe Subscriptions:

1. **Don't break existing users**
   - Keep Stripe implementation as-is

2. **Subscription check**
   - Check Stripe subscriptions
   - Grant PRO access based on Stripe status

3. **Data migration**
   - Set `subscription_source = 'stripe'` for existing PRO users
   - Update `monthly_allowance` based on current plan

### Example Migration Script:

```sql
-- Mark existing PRO users as Stripe subscribers
UPDATE users
SET
  subscription_source = 'stripe',
  subscription_status = 'ACTIVE',
  monthly_allowance = 100
WHERE
  stripe_subscription_id IS NOT NULL
  AND stripe_subscription_status = 'active';

-- Mark FREE users
UPDATE users
SET
  subscription_status = 'INACTIVE',
  monthly_allowance = 10
WHERE
  stripe_subscription_id IS NULL;
```

---

## 📝 Summary for Your Backend Team

### What You Need to Do:

**Critical (Must Have):**

1. ✅ Update `GET /subscriptions/me` to check Stripe subscriptions
2. ✅ Run database migrations (add columns)

**Optional (Nice to Have):** 6. 🎁 Create `POST /ads/reward` endpoint for ad-based credits 7. 🎁 Add ad credit tracking to database

### What Was Removed:

- ❌ Addon purchase endpoints (simplified monetization)
- ❌ One-time IAP verification
- ❌ `addonCreditsRemaining` field

### Questions?

Contact the frontend team with:

- Confirmation of database schema updates
- Test user credentials for subscription testing

---

**This document contains EVERYTHING your backend needs to support the KickerGPT mobile app! 🚀**
