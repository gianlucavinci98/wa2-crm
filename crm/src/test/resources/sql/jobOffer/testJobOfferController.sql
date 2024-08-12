-- Inizializzazione del database per i test del controller JobOfferControllerIntegrationTest

-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO contacts (contact_id, name, surname, ssn, category)
VALUES (100, 'John', 'Doe', '123456789', 0),
       (200, 'Jane', 'Doe', '987654321', 0);

-- Inserimento di alcuni dati di esempio nella tabella customer
INSERT INTO customers (customer_id, contact_id)
VALUES (100, 100),
       (200, 200);

-- Inserimento di alcuni dati di esempio nella tabella job_offers
INSERT INTO job_offers (job_offer_id, customer_customer_id, details, description, status, duration, value)
VALUES (100, 100, 'Details', 'Job Offer 1', 0, 30, 1000.0),
       (200, 200, 'Details', 'Job Offer 2', 4, 60, 2000.0);

-- Inserimento di alcune skills per i professionisti
INSERT INTO job_offer_required_skills (job_offer_job_offer_id, required_skills)
VALUES (100, 'Skill 1'),
       (100, 'Skill 2'),
       (200, 'Skill 3'),
       (200, 'Skill 4');
-- Inserimento di alcuni dati di esempio nella tabella job_offers_history
INSERT INTO job_offers_history (job_offer_history_id, job_offer_job_offer_id, status, note)
VALUES (100, 100, 0, 'Offer created'),
       (200, 100, 1, 'Offer in progress'),
       (300, 100, 4, 'Offer completed');

