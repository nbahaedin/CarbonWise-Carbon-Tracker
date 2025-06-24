-- Function to update user's total carbon saved
CREATE OR REPLACE FUNCTION update_carbon_saved(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_carbon_saved = total_carbon_saved + amount,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_profile RECORD;
  badge_record RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE id = user_id;
  
  -- Check each badge requirement
  FOR badge_record IN SELECT * FROM badges LOOP
    -- Skip if user already has this badge
    IF EXISTS (SELECT 1 FROM user_badges WHERE user_id = user_id AND badge_id = badge_record.id) THEN
      CONTINUE;
    END IF;
    
    -- Check if user meets the requirement
    IF (badge_record.requirement_type = 'total_saved' AND user_profile.total_carbon_saved >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'streak' AND user_profile.streak_days >= badge_record.requirement_value) THEN
      
      -- Award the badge
      INSERT INTO user_badges (user_id, badge_id) VALUES (user_id, badge_record.id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_activity_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get the most recent activity date
  SELECT MAX(date) INTO last_activity_date 
  FROM activities 
  WHERE user_id = user_id;
  
  -- Get current streak
  SELECT streak_days INTO current_streak 
  FROM profiles 
  WHERE id = user_id;
  
  -- Update streak based on activity date
  IF last_activity_date = CURRENT_DATE THEN
    -- Activity logged today, maintain or increment streak
    IF current_streak = 0 THEN
      UPDATE profiles SET streak_days = 1 WHERE id = user_id;
    END IF;
  ELSIF last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Activity logged yesterday, increment streak
    UPDATE profiles SET streak_days = current_streak + 1 WHERE id = user_id;
  ELSIF last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Gap in activities, reset streak
    UPDATE profiles SET streak_days = 1 WHERE id = user_id;
  END IF;
  
  -- Check for new badges after updating streak
  PERFORM check_and_award_badges(user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak and check badges when activity is added
CREATE OR REPLACE FUNCTION handle_activity_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Update carbon saved
  PERFORM update_carbon_saved(NEW.user_id, NEW.carbon_amount);
  
  -- Update streak
  PERFORM update_user_streak(NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_activity_insert
  AFTER INSERT ON activities
  FOR EACH ROW EXECUTE FUNCTION handle_activity_insert();
