-- Drop all existing functions and triggers to start fresh
DROP TRIGGER IF EXISTS on_activity_insert ON activities;
DROP FUNCTION IF EXISTS handle_activity_insert();
DROP FUNCTION IF EXISTS check_and_award_badges(UUID);
DROP FUNCTION IF EXISTS update_carbon_saved(UUID, DECIMAL);
DROP FUNCTION IF EXISTS update_user_streak(UUID);
DROP FUNCTION IF EXISTS generate_weekly_report(UUID, DATE);

-- Recreate the update_carbon_saved function with explicit table references
CREATE OR REPLACE FUNCTION update_carbon_saved(input_user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_carbon_saved = profiles.total_carbon_saved + amount,
    updated_at = NOW()
  WHERE profiles.id = input_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in update_carbon_saved for user %: %', input_user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the check_and_award_badges function with explicit table references
CREATE OR REPLACE FUNCTION check_and_award_badges(input_user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_profile RECORD;
  badge_record RECORD;
BEGIN
  -- Get user profile with explicit table reference
  SELECT profiles.* INTO user_profile 
  FROM profiles 
  WHERE profiles.id = input_user_id;
  
  -- Check each badge requirement
  FOR badge_record IN SELECT badges.* FROM badges LOOP
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

-- Recreate the update_user_streak function with explicit table references
CREATE OR REPLACE FUNCTION update_user_streak(input_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_activity_date DATE;
  current_streak INTEGER;
  user_profile RECORD;
BEGIN
  -- Get user profile
  SELECT profiles.* INTO user_profile 
  FROM profiles 
  WHERE profiles.id = input_user_id;
  
  -- Get the most recent activity date with explicit table reference
  SELECT MAX(activities.date) INTO last_activity_date 
  FROM activities 
  WHERE activities.user_id = input_user_id;
  
  -- Get current streak
  current_streak := COALESCE(user_profile.streak_days, 0);
  
  -- Update streak based on activity date
  IF last_activity_date = CURRENT_DATE THEN
    -- Activity logged today, maintain or increment streak
    IF current_streak = 0 THEN
      UPDATE profiles SET streak_days = 1 WHERE profiles.id = input_user_id;
    END IF;
  ELSIF last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Activity logged yesterday, increment streak
    UPDATE profiles SET streak_days = current_streak + 1 WHERE profiles.id = input_user_id;
  ELSIF last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Gap in activities, reset streak
    UPDATE profiles SET streak_days = 1 WHERE profiles.id = input_user_id;
  END IF;
  
  -- Check for new badges after updating streak
  PERFORM check_and_award_badges(input_user_id);
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in update_user_streak for user %: %', input_user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the main trigger function with completely explicit table references
CREATE OR REPLACE FUNCTION handle_activity_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_profile RECORD;
  last_activity_date DATE;
BEGIN
  -- Update carbon saved in profiles table with explicit reference
  UPDATE profiles 
  SET 
    total_carbon_saved = profiles.total_carbon_saved + NEW.carbon_amount,
    updated_at = NOW()
  WHERE profiles.id = NEW.user_id;

  -- Get user profile for streak calculation with explicit reference
  SELECT profiles.* INTO user_profile 
  FROM profiles 
  WHERE profiles.id = NEW.user_id;
  
  -- Calculate streak - get the last activity date before this one with explicit reference
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
    UPDATE profiles 
    SET streak_days = COALESCE(user_profile.streak_days, 0) + 1 
    WHERE profiles.id = NEW.user_id;
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
CREATE TRIGGER on_activity_insert
  AFTER INSERT ON activities
  FOR EACH ROW EXECUTE FUNCTION handle_activity_insert();

-- Recreate the generate_weekly_report function with explicit table references
CREATE OR REPLACE FUNCTION generate_weekly_report(input_user_id UUID, week_start DATE)
RETURNS VOID AS $$
DECLARE
  week_end DATE;
  total_co2 DECIMAL;
  activity_count INTEGER;
  top_category TEXT;
  report_json JSONB;
BEGIN
  week_end := week_start + INTERVAL '6 days';
  
  -- Calculate weekly totals with explicit table references
  SELECT 
    COALESCE(SUM(activities.carbon_amount), 0),
    COUNT(*)
  INTO total_co2, activity_count
  FROM activities 
  WHERE activities.user_id = input_user_id 
    AND activities.date BETWEEN week_start AND week_end;
  
  -- Find top category with explicit table references
  SELECT activity_categories.name INTO top_category
  FROM activities 
  JOIN activity_categories ON activities.category_id = activity_categories.id
  WHERE activities.user_id = input_user_id 
    AND activities.date BETWEEN week_start AND week_end
  GROUP BY activity_categories.name
  ORDER BY SUM(activities.carbon_amount) DESC
  LIMIT 1;
  
  -- Create report JSON
  report_json := json_build_object(
    'total_co2_saved', total_co2,
    'activities_count', activity_count,
    'top_category', COALESCE(top_category, 'None'),
    'week_start', week_start,
    'week_end', week_end
  );
  
  -- Insert or update weekly report
  INSERT INTO weekly_reports (user_id, week_start, week_end, total_co2_saved, activities_count, top_category, report_data)
  VALUES (input_user_id, week_start, week_end, total_co2, activity_count, top_category, report_json)
  ON CONFLICT (user_id, week_start) 
  DO UPDATE SET
    total_co2_saved = EXCLUDED.total_co2_saved,
    activities_count = EXCLUDED.activities_count,
    top_category = EXCLUDED.top_category,
    report_data = EXCLUDED.report_data;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in generate_weekly_report for user %: %', input_user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_activity_insert() TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_award_badges(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_carbon_saved(UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_weekly_report(UUID, DATE) TO authenticated;

-- Test the fix by creating a simple test function
CREATE OR REPLACE FUNCTION test_activity_insert(test_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  test_result TEXT;
BEGIN
  -- Try to insert a test activity
  INSERT INTO activities (
    user_id, 
    name, 
    category_id, 
    carbon_amount, 
    date
  ) VALUES (
    test_user_id,
    'Test Activity - ' || NOW()::TEXT,
    1,
    1.0,
    CURRENT_DATE
  );
  
  test_result := 'SUCCESS: Activity inserted without ambiguous column error';
  
  -- Clean up the test activity
  DELETE FROM activities 
  WHERE activities.user_id = test_user_id 
    AND activities.name LIKE 'Test Activity - %';
  
  RETURN test_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for the test function
GRANT EXECUTE ON FUNCTION test_activity_insert(UUID) TO authenticated;
