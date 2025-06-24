-- Enhanced function to update carbon saved and streaks
CREATE OR REPLACE FUNCTION handle_activity_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_profile RECORD;
  last_activity_date DATE;
  current_streak INTEGER;
BEGIN
  -- Update carbon saved
  UPDATE profiles 
  SET 
    total_carbon_saved = total_carbon_saved + NEW.carbon_amount,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Get user profile for streak calculation
  SELECT * INTO user_profile FROM profiles WHERE id = NEW.user_id;
  
  -- Calculate streak
  SELECT MAX(date) INTO last_activity_date 
  FROM activities 
  WHERE user_id = NEW.user_id AND date < NEW.date;
  
  -- Update streak logic
  IF last_activity_date IS NULL THEN
    -- First activity ever
    UPDATE profiles SET streak_days = 1 WHERE id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day
    UPDATE profiles SET streak_days = user_profile.streak_days + 1 WHERE id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Gap in activities, reset streak
    UPDATE profiles SET streak_days = 1 WHERE id = NEW.user_id;
  ELSIF NEW.date = CURRENT_DATE AND last_activity_date = CURRENT_DATE THEN
    -- Same day, maintain streak
    -- No change needed
  END IF;
  
  -- Check for new badges after updating
  PERFORM check_and_award_badges(NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate weekly report
CREATE OR REPLACE FUNCTION generate_weekly_report(user_id UUID, week_start DATE)
RETURNS VOID AS $$
DECLARE
  week_end DATE;
  total_co2 DECIMAL;
  activity_count INTEGER;
  top_category TEXT;
  report_json JSONB;
BEGIN
  week_end := week_start + INTERVAL '6 days';
  
  -- Calculate weekly totals
  SELECT 
    COALESCE(SUM(carbon_amount), 0),
    COUNT(*)
  INTO total_co2, activity_count
  FROM activities 
  WHERE user_id = user_id 
    AND date BETWEEN week_start AND week_end;
  
  -- Find top category
  SELECT ac.name INTO top_category
  FROM activities a
  JOIN activity_categories ac ON a.category_id = ac.id
  WHERE a.user_id = user_id 
    AND a.date BETWEEN week_start AND week_end
  GROUP BY ac.name
  ORDER BY SUM(a.carbon_amount) DESC
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
  VALUES (user_id, week_start, week_end, total_co2, activity_count, top_category, report_json)
  ON CONFLICT (user_id, week_start) 
  DO UPDATE SET
    total_co2_saved = EXCLUDED.total_co2_saved,
    activities_count = EXCLUDED.activities_count,
    top_category = EXCLUDED.top_category,
    report_data = EXCLUDED.report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
