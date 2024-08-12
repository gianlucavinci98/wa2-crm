-- Inizializzazione del database per i test del controller ProfessionalControllerIntegrationTest

-- Inserimento di alcuni dati di esempio nella tabella contacts
INSERT INTO contacts (contact_id, name, surname, ssn, category) VALUES
                                                                    (100, 'John', 'Doe', '123456789', 1),
                                                                    (300, 'Max', 'Doe', '123326789', 2),
                                                                    (200, 'Jane', 'Doe', '987654321', 1);

-- Inserimento di alcuni dati di esempio nella tabella professional
INSERT INTO professionals (professional_id, contact_id, daily_rate, location, employment_state) VALUES
                                                                                                         (100, 100, 30.0, 'New York', 0),
                                                                                                         (200, 200, 25.0, 'Los Angeles', 1);

-- Inserimento di alcune skills per i professionisti
INSERT INTO professional_skills (professional_professional_id, skills) VALUES
                                                             (100, 'Skill 1'),
                                                             (100, 'Skill 2'),
                                                             (200, 'Skill 3'),
                                                             (200, 'Skill 4');