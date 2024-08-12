-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO contacts (contact_id, name, surname, ssn, category)
VALUES (100, 'John', 'Doe', '123456789', 2),
       (101, 'Jane', 'Smith', '987654321', 2),
       (102, 'Mike', 'Johnson', '456789123', 2),
       (103, 'Emily', 'Brown', '654123789', 2),
       (104, 'Thomas', 'Radley', '436890976', 0);

-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO professionals (professional_id, daily_rate, employment_state, location, contact_id)
VALUES (100, 10, 1, 'New York', 100),
       (101, 15, 1, 'Chicago', 101),
       (102, 20, 1, 'New York', 102),
       (103, 20, 1, 'Los ANgeles', 103);

INSERT INTO professional_skills (professional_professional_id, skills)
VALUES (100, 'Cleaner'),
       (100, 'Builder'),
       (101, 'Plumber'),
       (102, 'Cleaner'),
       (103, 'Builder'),
       (103, 'Magician'),
       (103, 'Mechanic');
