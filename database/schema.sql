-- Supabase Database Schema for DSA Roadmap Tracker
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth handles this, but we'll add profile)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- User notes table
CREATE TABLE public.user_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_id TEXT NOT NULL,
    note_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day_id)
);

-- Skipped days table
CREATE TABLE public.skipped_days (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_id TEXT NOT NULL,
    skipped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day_id)
);

-- User statistics table (for caching streak data)
CREATE TABLE public.user_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    total_tasks_completed INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_completed_at ON public.user_progress(completed_at);
CREATE INDEX idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX idx_skipped_days_user_id ON public.skipped_days(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skipped_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
    ON public.user_progress FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for user_notes
CREATE POLICY "Users can view their own notes"
    ON public.user_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
    ON public.user_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
    ON public.user_notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
    ON public.user_notes FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for skipped_days
CREATE POLICY "Users can view their own skipped days"
    ON public.skipped_days FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skipped days"
    ON public.skipped_days FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skipped days"
    ON public.skipped_days FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
    ON public.user_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
    ON public.user_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email)
    );
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak data
CREATE OR REPLACE FUNCTION public.update_user_streaks(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_max_streak INTEGER := 0;
    v_temp_streak INTEGER := 1;
    v_last_date DATE;
    v_current_date DATE;
    v_total_tasks INTEGER;
BEGIN
    -- Get total completed tasks
    SELECT COUNT(*) INTO v_total_tasks
    FROM public.user_progress
    WHERE user_id = p_user_id;
    
    -- Calculate streaks from completion dates
    FOR v_current_date IN (
        SELECT DISTINCT DATE(completed_at) as completion_date
        FROM public.user_progress
        WHERE user_id = p_user_id
        ORDER BY completion_date
    ) LOOP
        IF v_last_date IS NULL THEN
            v_temp_streak := 1;
        ELSIF v_current_date = v_last_date + INTERVAL '1 day' THEN
            v_temp_streak := v_temp_streak + 1;
        ELSE
            v_temp_streak := 1;
        END IF;
        
        v_max_streak := GREATEST(v_max_streak, v_temp_streak);
        v_last_date := v_current_date;
    END LOOP;
    
    -- Calculate current streak
    IF v_last_date IS NOT NULL AND 
       (CURRENT_DATE - v_last_date) <= 1 THEN
        v_current_streak := v_temp_streak;
    END IF;
    
    -- Update stats table
    INSERT INTO public.user_stats (
        user_id, 
        current_streak, 
        max_streak, 
        total_tasks_completed,
        last_activity_date,
        updated_at
    )
    VALUES (
        p_user_id,
        v_current_streak,
        v_max_streak,
        v_total_tasks,
        v_last_date,
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        current_streak = v_current_streak,
        max_streak = GREATEST(user_stats.max_streak, v_max_streak),
        total_tasks_completed = v_total_tasks,
        last_activity_date = v_last_date,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streaks when progress changes
CREATE OR REPLACE FUNCTION public.trigger_update_streaks()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.update_user_streaks(
        COALESCE(NEW.user_id, OLD.user_id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_progress_change
    AFTER INSERT OR DELETE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_streaks();