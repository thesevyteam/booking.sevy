CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_uid VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  city VARCHAR(255) NOT NULL,
  geohash4 CHAR(4) NOT NULL,
  geohash5 CHAR(5) NOT NULL,
  geohash6 CHAR(6) NOT NULL,
  images JSON NOT NULL,
  reviews JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_uid) REFERENCES users(uid)
);