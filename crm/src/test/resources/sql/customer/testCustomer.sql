-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO contacts (contact_id, name, surname, ssn, category)
VALUES (100, 'John', 'Doe', '123456789', 2),
       (101, 'Jane', 'Smith', '987654321', 2),
       (102, 'Mike', 'Johnson', '456789123', 2),
       (103, 'Emily', 'Brown', '654123789', 0),
       (104, 'Thomas', 'Radley', '436890976', 1);

INSERT INTO customers (customer_id, contact_id)
VALUES (103, 103)
