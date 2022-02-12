
INSERT INTO organizations (name, email, phone) 
VALUES ('Lighthouse Lab', 'lhl@lighthouselab.com', '1-888-569-6898');

INSERT INTO users (username, password, email, phone, full_name, organization_id) 
VALUES ('jane', 'password', 'jane@lhl.com', '416 392-2489', 'Jane Doe', 1);
INSERT INTO users (username, password, email, phone, full_name, organization_id) 
VALUES ('john', 'password', 'john@lhl.com', '416 392-2490', 'John Doe', 1);
INSERT INTO users (username, password, email, phone, full_name, organization_id) 
VALUES ('alice', 'password', 'alice@lhl.com', '416 392-2491', 'Alice Doe', 1);

INSERT INTO categories (name) 
VALUES ('Social');
INSERT INTO categories (name) 
VALUES ('Work');
INSERT INTO categories (name) 
VALUES ('Entertainment');

INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id) 
VALUES ('lhlfacebook', 'password', '../images/facebook.png', 'http://www.facebook.com', 'Facebook', 1, 1, 1);
INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id) 
VALUES ('lhltwitter', 'password', '../images/twitter.jpg', 'http://www.twitter.com', 'Twitter', 1, 1, 1);
INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id) 
VALUES ('lhlcompass', 'password', NULL, 'https://web.compass.lighthouselabs.ca/', 'Compass', 2, 1, 2);
INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id) 
VALUES ('lhlnetflix', 'password', '../images/netflix.png', 'http://www.netflix.com', 'Netflix', 3, 1, 3);
INSERT INTO credentials (username, password, logo_url, url, name, creator_id, organization_id, category_id) 
VALUES ('lhlprimevideo', 'password', '../images/prime.png', 'https://www.primevideo.com', 'Prime Video', 3, 1, 3);
