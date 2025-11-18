# Database Setup

## Run this schema in Supabase

1. Go to your Supabase project
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the entire content of `schema.sql`
5. Paste it into the editor
6. Click **"Run"** (green play button)

## What this schema creates:

- `user_profiles` - User profile information
- `user_progress` - Task completion tracking
- `user_notes` - User notes for each day
- `skipped_days` - Days that users skip
- `user_stats` - Cached statistics (streaks, totals)
- Automatic triggers for streak calculation
- Row Level Security (RLS) policies

## Verify it worked:

In Supabase, go to **Table Editor** and you should see:
- user_profiles
- user_progress
- user_notes
- skipped_days
- user_stats