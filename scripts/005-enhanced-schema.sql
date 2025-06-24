-- Create emission factors table for automatic calculations
CREATE TABLE IF NOT EXISTS emission_factors (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES activity_categories(id),
  activity_type TEXT NOT NULL,
  unit TEXT NOT NULL, -- 'km', 'meal', 'kwh', 'item', etc.
  co2_per_unit DECIMAL NOT NULL, -- kg CO2 per unit
  description TEXT,
  source TEXT, -- data source reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity templates table
CREATE TABLE IF NOT EXISTS activity_templates (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES activity_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  emission_factor_id INTEGER REFERENCES emission_factors(id),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tips table for personalized suggestions
CREATE TABLE IF NOT EXISTS tips (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES activity_categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tip_type TEXT CHECK (tip_type IN ('post_activity', 'weekly', 'achievement', 'streak')),
  trigger_condition TEXT, -- JSON condition for when to show tip
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL, -- 'daily', 'weekly', 'category_specific'
  category_id INTEGER REFERENCES activity_categories(id),
  current_count INTEGER DEFAULT 0,
  best_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weekly reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_co2_saved DECIMAL DEFAULT 0,
  activities_count INTEGER DEFAULT 0,
  top_category TEXT,
  report_data JSONB, -- detailed breakdown
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update activities table to include quantity and unit
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS quantity DECIMAL DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'item',
ADD COLUMN IF NOT EXISTS emission_factor_id INTEGER REFERENCES emission_factors(id),
ADD COLUMN IF NOT EXISTS auto_calculated BOOLEAN DEFAULT false;

-- Insert emission factors data
INSERT INTO emission_factors (category_id, activity_type, unit, co2_per_unit, description, source) VALUES
-- Transport
(1, 'walking_vs_car', 'km', 0.21, 'CO2 saved per km walked instead of driving', 'EPA 2023'),
(1, 'cycling_vs_car', 'km', 0.21, 'CO2 saved per km cycled instead of driving', 'EPA 2023'),
(1, 'public_transport_vs_car', 'km', 0.15, 'CO2 saved per km using public transport vs car', 'EPA 2023'),
(1, 'carpooling', 'km', 0.105, 'CO2 saved per km through carpooling (50% reduction)', 'EPA 2023'),
(1, 'work_from_home', 'day', 12.0, 'CO2 saved per day working from home (avg commute)', 'Studies 2023'),

-- Energy
(2, 'led_bulb_replacement', 'bulb', 0.5, 'CO2 saved per LED bulb vs incandescent (annual)', 'Energy Star'),
(2, 'unplug_devices', 'day', 1.2, 'CO2 saved per day unplugging phantom loads', 'DOE 2023'),
(2, 'thermostat_adjustment', 'degree', 4.0, 'CO2 saved per degree celsius reduction (monthly)', 'EPA 2023'),
(2, 'air_dry_clothes', 'load', 2.3, 'CO2 saved per load air-dried vs machine dried', 'Energy Star'),
(2, 'shorter_shower', 'minute', 0.3, 'CO2 saved per minute reduction in shower time', 'Water Studies'),

-- Food
(3, 'vegetarian_meal', 'meal', 2.5, 'CO2 saved per vegetarian meal vs meat meal', 'FAO 2023'),
(3, 'vegan_meal', 'meal', 3.2, 'CO2 saved per vegan meal vs meat meal', 'FAO 2023'),
(3, 'local_produce', 'meal', 1.8, 'CO2 saved per meal with local produce', 'Food Miles Study'),
(3, 'reduce_food_waste', 'meal', 1.5, 'CO2 saved per meal by reducing food waste', 'UNEP 2023'),
(3, 'tap_water_vs_bottled', 'liter', 0.15, 'CO2 saved per liter tap water vs bottled', 'Water Footprint'),

-- Shopping
(4, 'second_hand_clothing', 'item', 8.5, 'CO2 saved per clothing item bought second-hand', 'Fashion Industry'),
(4, 'repair_vs_replace', 'item', 15.0, 'CO2 saved per item repaired instead of replaced', 'Circular Economy'),
(4, 'reusable_bag', 'use', 0.04, 'CO2 saved per use of reusable bag vs plastic', 'Plastic Studies'),
(4, 'digital_receipt', 'receipt', 0.01, 'CO2 saved per digital receipt vs paper', 'Paper Industry'),

-- Waste
(5, 'recycling', 'kg', 0.5, 'CO2 saved per kg of material recycled', 'EPA Recycling'),
(5, 'composting', 'kg', 0.3, 'CO2 saved per kg of organic waste composted', 'Composting Studies'),
(5, 'reduce_plastic', 'item', 0.2, 'CO2 saved per single-use plastic item avoided', 'Plastic Impact');

-- Insert activity templates
INSERT INTO activity_templates (category_id, name, description, unit, emission_factor_id, icon) VALUES
-- Transport templates
(1, 'Walked instead of driving', 'Distance walked instead of taking a car', 'km', 1, '🚶'),
(1, 'Cycled instead of driving', 'Distance cycled instead of taking a car', 'km', 2, '🚴'),
(1, 'Used public transport', 'Distance traveled by public transport instead of car', 'km', 3, '🚌'),
(1, 'Carpooled', 'Distance traveled by carpooling', 'km', 4, '🚗'),
(1, 'Worked from home', 'Days worked from home instead of commuting', 'day', 5, '🏠'),

-- Energy templates
(2, 'Replaced with LED bulb', 'Number of LED bulbs installed', 'bulb', 6, '💡'),
(2, 'Unplugged devices', 'Days of unplugging unused devices', 'day', 7, '🔌'),
(2, 'Lowered thermostat', 'Degrees celsius reduced on thermostat', 'degree', 8, '🌡️'),
(2, 'Air-dried clothes', 'Loads of laundry air-dried', 'load', 9, '👕'),
(2, 'Shorter shower', 'Minutes reduced in shower time', 'minute', 10, '🚿'),

-- Food templates
(3, 'Ate vegetarian meal', 'Number of vegetarian meals', 'meal', 11, '🥗'),
(3, 'Ate vegan meal', 'Number of vegan meals', 'meal', 12, '🌱'),
(3, 'Bought local produce', 'Meals with locally sourced ingredients', 'meal', 13, '🥕'),
(3, 'Reduced food waste', 'Meals where food waste was minimized', 'meal', 14, '♻️'),
(3, 'Drank tap water', 'Liters of tap water instead of bottled', 'liter', 15, '🚰'),

-- Shopping templates
(4, 'Bought second-hand', 'Items purchased second-hand', 'item', 16, '👔'),
(4, 'Repaired instead of replacing', 'Items repaired instead of buying new', 'item', 17, '🔧'),
(4, 'Used reusable bag', 'Times used reusable shopping bag', 'use', 18, '🛍️'),
(4, 'Chose digital receipt', 'Digital receipts instead of paper', 'receipt', 19, '📱'),

-- Waste templates
(5, 'Recycled materials', 'Kilograms of materials recycled', 'kg', 20, '♻️'),
(5, 'Composted organic waste', 'Kilograms of organic waste composted', 'kg', 21, '🌱'),
(5, 'Avoided single-use plastic', 'Single-use plastic items avoided', 'item', 22, '🚫');

-- Insert personalized tips
INSERT INTO tips (category_id, title, content, tip_type, trigger_condition) VALUES
-- Transport tips
(1, 'Great job walking!', 'Walking just 30 minutes a day can save 76kg of CO₂ annually while improving your health!', 'post_activity', '{"activity_type": "walking_vs_car"}'),
(1, 'Cycling champion!', 'If you cycle 10km daily instead of driving, you could save 766kg of CO₂ per year - equivalent to planting 35 trees!', 'post_activity', '{"activity_type": "cycling_vs_car"}'),
(1, 'Public transport hero!', 'Using public transport reduces traffic congestion and can save up to 4,800 pounds of CO₂ annually per person!', 'post_activity', '{"activity_type": "public_transport_vs_car"}'),

-- Energy tips
(2, 'LED lighting wins!', 'LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs. You''re making a smart choice!', 'post_activity', '{"activity_type": "led_bulb_replacement"}'),
(2, 'Phantom load fighter!', 'Electronics in standby mode can account for 10% of your home''s energy use. Keep unplugging those devices!', 'post_activity', '{"activity_type": "unplug_devices"}'),
(2, 'Temperature master!', 'Each degree you lower your thermostat can save 6-8% on heating costs and significantly reduce emissions!', 'post_activity', '{"activity_type": "thermostat_adjustment"}'),

-- Food tips
(3, 'Plant-powered impact!', 'If everyone ate vegetarian one day per week, it would be like taking 10.5 million cars off the road!', 'post_activity', '{"activity_type": "vegetarian_meal"}'),
(3, 'Vegan victory!', 'A vegan diet can reduce your food-related carbon footprint by up to 73%. Every meal counts!', 'post_activity', '{"activity_type": "vegan_meal"}'),
(3, 'Local food champion!', 'Food travels an average of 1,500 miles to reach your plate. Buying local reduces this significantly!', 'post_activity', '{"activity_type": "local_produce"}'),

-- Shopping tips
(4, 'Second-hand superstar!', 'The fashion industry produces 10% of global carbon emissions. Buying second-hand extends clothing life and reduces waste!', 'post_activity', '{"activity_type": "second_hand_clothing"}'),
(4, 'Repair revolution!', 'Repairing items instead of replacing them can reduce waste by up to 80% and save significant resources!', 'post_activity', '{"activity_type": "repair_vs_replace"}'),

-- Waste tips
(5, 'Recycling rockstar!', 'Recycling one aluminum can saves enough energy to power a TV for 3 hours. Keep up the great work!', 'post_activity', '{"activity_type": "recycling"}'),
(5, 'Composting champion!', 'Composting reduces methane emissions from landfills and creates nutrient-rich soil. You''re closing the loop!', 'post_activity', '{"activity_type": "composting"}');

-- Enable RLS for new tables
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Everyone can view emission factors" ON emission_factors FOR SELECT USING (true);
CREATE POLICY "Everyone can view activity templates" ON activity_templates FOR SELECT USING (true);
CREATE POLICY "Everyone can view tips" ON tips FOR SELECT USING (true);

CREATE POLICY "Users can view own streaks" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON user_streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON weekly_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON weekly_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
