# Progetto Analytics

## Descrizione del Progetto

Questo progetto è composto dai seguenti componenti:

1. **Integrazione Apache Kafka come Consumer**:
    - Step 1: Recepire in diretta i messaggi in arrivo sul cluster Kafka e scriverli in console.

2. **Database**:
    - Utilizzo di Postgres o MongoDB.
    - I messaggi verranno impacchettati come DTO e scritti nel database.

3. **API**:
    - Esporre un set di API che permetta di interrogare il database.
    - Le API dovrebbero essere molto semplici perchè dovranno solo
leggere i dati già ben intabellati nel database e pronti per la visualizzazione (se non addirittura già manipolati con Kafka Stream).

4. **Frontend**:
    - Il frontend che abbiamo già dovrà includere anche le API per ottenere i dati dal database.

## Integrazioni Future

- **Sicurezza**:
    - Implementazione dell'architettura di sicurezza già presente nel progetto crm, questo perchè in teoria 
  solo gli utenti con il ruolo di manager potranno accedere ai dati.

- **Kafka Stream**:
    - Utilizzo di Kafka Stream per la lavorazione dei dati prima dell'inserimento nel database.

prova
