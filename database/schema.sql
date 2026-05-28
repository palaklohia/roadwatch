-- Create Database
CREATE DATABASE IF NOT EXISTS complaint_routing_db;
USE complaint_routing_db;

-- Table 1: Complaint Categories
CREATE TABLE complaint_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  severity_weight INT DEFAULT 1,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Authorities
CREATE TABLE authorities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  category_id INT,
  jurisdiction VARCHAR(255),
  response_time_hours INT DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES complaint_categories(id)
);

-- Table 3: Infrastructure
CREATE TABLE infrastructure (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('NH', 'SH', 'MDR', 'street', 'lane', 'other') NOT NULL,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contractor_id INT,
  budget_sanctioned DECIMAL(12, 2),
  budget_spent DECIMAL(12, 2),
  last_maintained DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Contractors
CREATE TABLE contractors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  complaint_count INT DEFAULT 0,
  repair_count INT DEFAULT 0,
  shame_score DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link contractors to infrastructure
ALTER TABLE infrastructure ADD FOREIGN KEY (contractor_id) REFERENCES contractors(id);

-- Table 5: Complaints
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  subcategory VARCHAR(100),
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  infrastructure_id INT,
  photo_url VARCHAR(500),
  video_url VARCHAR(500),
  severity INT DEFAULT 1,
  affected_people INT DEFAULT 0,
  status ENUM('pending', 'acknowledged', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
  authority_id INT,
  contractor_id INT,
  reporter_name VARCHAR(255),
  reporter_phone VARCHAR(20),
  reporter_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES complaint_categories(id),
  FOREIGN KEY (infrastructure_id) REFERENCES infrastructure(id),
  FOREIGN KEY (authority_id) REFERENCES authorities(id),
  FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

-- Table 6: Status Log
CREATE TABLE complaint_status_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  updated_by VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);

-- Table 7: Repeat Offenders
CREATE TABLE repeat_offenders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  infrastructure_id INT,
  contractor_id INT,
  complaint_count INT DEFAULT 0,
  last_complaint_date DATE,
  shame_score DECIMAL(5, 2),
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (infrastructure_id) REFERENCES infrastructure(id),
  FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

-- Table 8: Resolution Metrics
CREATE TABLE resolution_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  authority_id INT,
  total_complaints INT DEFAULT 0,
  resolved_count INT DEFAULT 0,
  avg_resolution_time_hours DECIMAL(10, 2),
  satisfaction_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES complaint_categories(id),
  FOREIGN KEY (authority_id) REFERENCES authorities(id)
);

-- Indexes
CREATE INDEX idx_complaints_category ON complaints(category_id);
CREATE INDEX idx_complaints_location ON complaints(latitude, longitude);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_created ON complaints(created_at);

-- Insert Initial Data
INSERT INTO complaint_categories (name, description, icon) VALUES
('Pothole', 'Road surface damage', '🕳️'),
('Waterlogging', 'Water accumulation on roads', '💧'),
('Broken Streetlight', 'Non-functional street lamp', '💡'),
('Fallen Tree', 'Tree blocking road or property', '🌳'),
('Accident', 'Vehicle accident or collision', '🚗'),
('Roadkill', 'Dead animal on road', '🐾'),
('Missing Sign', 'Traffic sign missing or damaged', '⚠️'),
('Heat Issue', 'Heat-related emergency', '🌡️'),
('Fire Hazard', 'Fire risk on road', '🔥'),
('Other', 'Other infrastructure issue', '❓');

INSERT INTO authorities (name, email, category_id, jurisdiction, response_time_hours) VALUES
('Road Maintenance Dept', 'road@example.gov.in', 1, 'Delhi', 24),
('Water Management', 'water@example.gov.in', 2, 'Delhi', 12),
('Municipal Corporation', 'municipal@example.gov.in', 3, 'Delhi', 48),
('Forest Dept', 'forest@example.gov.in', 4, 'Delhi', 24),
('Traffic Police', 'traffic@example.gov.in', 5, 'Delhi', 2),
('Animal Control', 'animals@example.gov.in', 6, 'Delhi', 24),
('Public Works', 'works@example.gov.in', 7, 'Delhi', 72),
('Emergency Services', 'emergency@example.gov.in', 8, 'Delhi', 1);

INSERT INTO infrastructure (name, type, location, latitude, longitude) VALUES
('Main Road', 'NH', 'Delhi Center', 28.6139, 77.2090),
('Park Street', 'street', 'South Delhi', 28.5244, 77.1855),
('Market Lane', 'lane', 'North Delhi', 28.7041, 77.1025),
('Highway 1', 'NH', 'Outer Ring Road', 28.5355, 77.2635),
('Municipal Road', 'MDR', 'East Delhi', 28.5921, 77.2788);

INSERT INTO contractors (name, email, phone) VALUES
('ABC Road Works', 'contact@abcroads.com', '9876543210'),
('XYZ Infrastructure', 'info@xyzinfra.com', '9876543211'),
('Prime Builders', 'sales@primebuilders.com', '9876543212');