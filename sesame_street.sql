USE first_sql;

CREATE TABLE sesameStreet (
  id SERIAL PRIMARY KEY,
  puppetName VARCHAR(255),
  species VARCHAR(255),
  demeanor VARCHAR(255)
);

INSERT INTO sesameStreet (puppetName, species, demeanor) VALUES ('Big Bird', 'Bird', 'Cheerful');
INSERT INTO sesameStreet (puppetName, species, demeanor) VALUES ('Burt', 'Human', 'Miserable');

SELECT * FROM sesameStreet;
SELECT puppetName FROM sesameStreet;
