-- Inserimento di un job offer
INSERT INTO job_offers (job_offer_id, description, status, duration, value, details)
VALUES (124, 'Offerta di lavoro per sviluppatore Java', 0, 30, 0.0, 'Dettagli offerta');

-- Inserimento di un customer
INSERT INTO contacts (contact_id, name, surname, ssn)
VALUES (100, 'Mario', 'Rossi', '123456789'),
       (101, 'Luigi', 'Verdi', '987654321');

-- Inserisci un professional di test associato al contatto sopra
INSERT INTO professionals (professional_id, daily_rate, employment_state, location, contact_id)
VALUES (100, 10, 1, 'New York', 101),
       (101, 10, 1, 'Torino', 100);

-- Inserisci un cliente di test associato al contatto sopra
INSERT INTO customers (customer_id, contact_id)
VALUES (100, 100);

-- Collegamento del job offer con il customer
UPDATE job_offers
SET customer_customer_id = (SELECT contact_id FROM contacts WHERE name = 'Mario');

-- Inserimento di uno storico per l'offerta di lavoro
INSERT INTO job_offers_history (job_offer_history_id, job_offer_job_offer_id, status, date, note)
VALUES (100, (SELECT job_offer_id FROM job_offers WHERE description = 'Offerta di lavoro per sviluppatore Java'), 0,
        NOW() - INTERVAL '1 day', 'Offerta creata');