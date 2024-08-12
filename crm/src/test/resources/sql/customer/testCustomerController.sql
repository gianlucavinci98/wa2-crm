-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO contacts (contact_id, name, surname, ssn, category) VALUES
                                                                    (100, 'John', 'Doe', '123456789', 0),
                                                                    (300, 'Mike', 'Doe', '123456389', 2),
                                                                    (200, 'Alice', 'Smith', '987654321', 0);
-- Inserimento di alcuni dati di esempio nella tabella customer
INSERT INTO customers (customer_id, contact_id) VALUES (100, 100), (200, 200);

-- Inserimento di alcuni dati di esempio nella tabella customer_notes
INSERT INTO customer_notes (customer_customer_id, notes) VALUES
                                                   (100, 'Note 1'), (100, 'Note 2');