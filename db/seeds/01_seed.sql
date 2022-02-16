
INSERT INTO organizations (name, email, phone)
VALUES  ('Lighthouse Lab', 'lhl@lighthouselab.com', '1-888-569-6898');

INSERT INTO users (username, password, email, phone, full_name, organization_id)
VALUES  ('jane', 'password', 'jane@lhl.com', '416 392-2489', 'Jane Doe', 1),
        ('john', 'password', 'john@lhl.com', '416 392-2490', 'John Doe', 1),
        ('alice', 'password', 'alice@lhl.com', '416 392-2491', 'Alice Doe', 1);

INSERT INTO categories (name)
VALUES  ('Uncategorized'),
        ('Social'),
        ('Work'),
        ('Entertainment');

INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id)
VALUES  ('lhlfacebook', '4c571fba99a85965afcd2a6009acbece.b34bbb49b6f4fa25', '../images/facebook.png', 'http://www.facebook.com', 'Facebook', 1, 1, 2),
        ('lhltwitter', '4c571fba99a85965afcd2a6009acbece.b34bbb49b6f4fa25', '../images/twitter.jpg', 'http://www.twitter.com', 'Twitter', 1, 1, 2),
        ('lhlcompass', '4c571fba99a85965afcd2a6009acbece.b34bbb49b6f4fa25', NULL, 'https://web.compass.lighthouselabs.ca/', 'Compass', 2, 1, 3),
        ('lhlnetflix', '4c571fba99a85965afcd2a6009acbece.b34bbb49b6f4fa25', '../images/netflix.png', 'http://www.netflix.com', 'Netflix', 3, 1, 4),
        ('lhlprimevideo', '4c571fba99a85965afcd2a6009acbece.b34bbb49b6f4fa25', '../images/prime.png', 'https://www.primevideo.com', 'Prime Video', 3, 1, 4);

INSERT INTO configurations (attribute, value)
VALUES  ('ENCRYPTION_KEY', 'xgQQdME193stVIIfgIqZZH0JP+s+5wod');
