-- Drop and recreate the problematic function with proper column references
DROP FUNCTION IF EXISTS handle_activity_insert();

-- Create the fixed function with explicit table aliases
CREATE OR REPLACE FUNCTION handle_activity_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_profile RECORD;
  last_activity_date DATE;
BEGIN
  -- Update carbon saved in profiles table
  UPDATE profiles 
  SET 
    total_carbon_saved = total_carbon_saved + NEW.carbon_amount,
    updated_at = NOW()
  WHERE profiles.id = NEW.user_id;

  -- Get user profile for streak calculation
  SELECT * INTO user_profile FROM profiles WHERE profiles.id = NEW.user_id;
  
  -- Calculate streak - get the last activity date before this one
  SELECT MAX(activities.date) INTO last_activity_date 
  FROM activities 
  WHERE activities.user_id = NEW.user_id 
    AND activities.date < NEW.date
    AND activities.id != NEW.id;
  
  -- Update streak logic
  IF last_activity_date IS NULL THEN
    -- First activity ever
    UPDATE profiles SET streak_days = 1 WHERE profiles.id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day
    UPDATE profiles SET streak_days = COALESCE(user_profile.streak_days, 0) + 1 WHERE profiles.id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Gap in activities, reset streak
    UPDATE profiles SET streak_days = 1 WHERE profiles.id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date = CURRENT_DATE THEN
    -- Same day, maintain streak (no change needed)
    NULL;
  END IF;
  
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
DROP TRIGGER IF EXISTS on_activity_insert ON activities;
CREATE TRIGGER on_activity_insert
  AFTER INSERT ON activities
  FOR EACH ROW EXECUTE FUNCTION handle_activity_insert();

-- Also fix the check_and_award_badges function
CREATE OR REPLACE FUNCTION check_and_award_badges(input_user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_profile RECORD;
  badge_record RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE profiles.id = input_user_id;
  
  -- Check each badge requirement
  FOR badge_record IN SELECT * FROM badges LOOP
    -- Skip if user already has this badge
    IF EXISTS (
      SELECT 1 FROM user_badges 
      WHERE user_badges.user_id = input_user_id 
        AND user_badges.badge_id = badge_record.id
    ) THEN
      CONTINUE;
    END IF;
    
    -- Check if user meets the requirement
    IF (badge_record.requirement_type = 'total_saved' AND user_profile.total_carbon_saved >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'streak' AND user_profile.streak_days >= badge_record.requirement_value) THEN
      
      -- Award the badge
      INSERT INTO user_badges (user_id, badge_id) 
      VALUES (input_user_id, badge_record.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail
    RAISE LOG 'Error in check_and_award_badges for user %: %', input_user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix the update_carbon_saved function as well
CREATE OR REPLACE FUNCTION update_carbon_saved(input_user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_carbon_saved = total_carbon_saved + amount,
    updated_at = NOW()
  WHERE profiles.id = input_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in update_carbon_saved for user %: %', input_user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure all necessary permissions are granted
GRANT EXECUTE ON FUNCTION handle_activity_insert() TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_award_badges(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_carbon_saved(UUID, DECIMAL) TO authenticated;
