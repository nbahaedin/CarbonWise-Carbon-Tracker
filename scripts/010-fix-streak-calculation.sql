-- Drop and recreate the streak calculation function with proper daily logic
DROP FUNCTION IF EXISTS handle_activity_insert();

-- Create improved streak calculation function
CREATE OR REPLACE FUNCTION handle_activity_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_profile RECORD;
  activity_dates DATE[];
  unique_dates DATE[];
  current_streak INTEGER := 0;
  best_streak INTEGER := 0;
  temp_streak INTEGER := 0;
  check_date DATE;
  today DATE := CURRENT_DATE;
  i INTEGER;
BEGIN
  -- Update carbon saved in profiles table
  UPDATE profiles 
  SET 
    total_carbon_saved = profiles.total_carbon_saved + NEW.carbon_amount,
    updated_at = NOW()
  WHERE profiles.id = NEW.user_id;

  -- Get all activity dates for this user (including the new one)
  SELECT ARRAY_AGG(DISTINCT activities.date ORDER BY activities.date DESC) 
  INTO activity_dates
  FROM activities 
  WHERE activities.user_id = NEW.user_id;

  -- Calculate current streak (consecutive days from today backwards)
  check_date := today;
  
  -- Check if there's activity today
  IF today = ANY(activity_dates) THEN
    current_streak := 1;
    check_date := today - INTERVAL '1 day';
    
    -- Count consecutive days backwards
    WHILE check_date = ANY(activity_dates) LOOP
      current_streak := current_streak + 1;
      check_date := check_date - INTERVAL '1 day';
    END LOOP;
  ELSE
    -- Check if there's activity yesterday
    check_date := today - INTERVAL '1 day';
    IF check_date = ANY(activity_dates) THEN
      current_streak := 1;
      check_date := check_date - INTERVAL '1 day';
      
      -- Count consecutive days backwards
      WHILE check_date = ANY(activity_dates) LOOP
        current_streak := current_streak + 1;
        check_date := check_date - INTERVAL '1 day';
      END LOOP;
    END IF;
  END IF;

  -- Calculate best streak ever
  temp_streak := 0;
  best_streak := 0;
  
  FOR i IN 1..array_length(activity_dates, 1) LOOP
    IF i = 1 THEN
      temp_streak := 1;
    ELSIF activity_dates[i-1] - activity_dates[i] = 1 THEN
      temp_streak := temp_streak + 1;
    ELSE
      best_streak := GREATEST(best_streak, temp_streak);
      temp_streak := 1;
    END IF;
  END LOOP;
  
  best_streak := GREATEST(best_streak, temp_streak);

  -- Update user profile with correct streak
  UPDATE profiles 
  SET 
    streak_days = current_streak,
    updated_at = NOW()
  WHERE profiles.id = NEW.user_id;

  -- Check for new badges after updating
  PERFORM check_and_award_badges(NEW.user_id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE LOG 'Error in handle_activity_insert for user %: %', NEW.user_id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_activity_insert
  AFTER INSERT ON activities
  FOR EACH ROW EXECUTE FUNCTION handle_activity_insert();

-- Grant permissions
GRANT EXECUTE ON FUNCTION handle_activity_insert() TO authenticated;
