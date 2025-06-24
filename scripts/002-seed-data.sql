-- Insert activity categories
INSERT INTO activity_categories (name, icon, color) VALUES
('Transport', '🚗', '#ef4444'),
('Energy', '⚡', '#f59e0b'),
('Food', '🍽️', '#10b981'),
('Shopping', '🛍️', '#8b5cf6'),
('Waste', '🗑️', '#6b7280');

-- Insert sample badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('Eco Warrior', 'Save 10kg of CO2', '🌱', 'total_saved', 10),
('Week Streak', 'Log activities for 7 days straight', '🔥', 'streak', 7),
('Carbon Crusher', 'Save 50kg of CO2', '💚', 'total_saved', 50),
('Consistency King', 'Log activities for 30 days straight', '👑', 'streak', 30),
('Planet Protector', 'Save 100kg of CO2', '🌍', 'total_saved', 100);

-- Insert sample suggestions
INSERT INTO suggestions (category_id, title, description, potential_savings, difficulty) VALUES
(1, 'Walk or bike for short trips', 'Replace car trips under 2km with walking or cycling', 2.5, 'easy'),
(1, 'Use public transport', 'Take the bus or train instead of driving', 4.8, 'easy'),
(1, 'Work from home once a week', 'Reduce commuting by working remotely', 12.0, 'medium'),
(2, 'Switch to LED bulbs', 'Replace incandescent bulbs with energy-efficient LEDs', 0.5, 'easy'),
(2, 'Unplug devices when not in use', 'Reduce phantom power consumption', 1.2, 'easy'),
(2, 'Lower thermostat by 2°C', 'Reduce heating and cooling energy usage', 8.0, 'medium'),
(3, 'Have one meat-free day per week', 'Reduce meat consumption to lower carbon footprint', 3.2, 'easy'),
(3, 'Buy local and seasonal produce', 'Reduce transportation emissions from food', 1.8, 'medium'),
(4, 'Buy second-hand clothing', 'Reduce manufacturing emissions by buying used items', 2.1, 'easy'),
(4, 'Repair instead of replace', 'Fix items instead of buying new ones', 5.5, 'medium');
