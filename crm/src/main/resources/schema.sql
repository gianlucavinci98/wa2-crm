CREATE SEQUENCE if not exists addresses_address_id_seq;
create table if not exists public.addresses (
                                                address_id bigint primary key not null default nextval('addresses_address_id_seq'::regclass),
                                                address character varying(255)
);

CREATE SEQUENCE if not exists contacts_contact_id_seq;

create table if not exists public.contacts (
                                               contact_id bigint primary key not null default nextval('contacts_contact_id_seq'::regclass),
                                               category smallint,
                                               name character varying(255),
                                               ssn character varying(255),
                                               surname character varying(255)
);
create table if not exists public.address_contact_bridge (
                                               address_id bigint not null,
                                               contact_id bigint not null,
                                               primary key (address_id, contact_id),
                                               foreign key (address_id) references public.addresses (address_id)
                                                   match simple on update no action on delete no action,
                                               foreign key (contact_id) references public.contacts (contact_id)
                                                   match simple on update no action on delete no action
);


CREATE SEQUENCE if not exists customers_customer_id_seq;
create table if not exists public.customers (
                                 customer_id bigint primary key not null default nextval('customers_customer_id_seq'::regclass),
                                 contact_id bigint,
                                 foreign key (contact_id) references public.contacts (contact_id)
                                     match simple on update no action on delete no action
);
create unique index if not exists uk_9wi1wa1mp861xeqlfxeyg5t8m on customers using btree (contact_id);

create table if not exists public.customer_notes (
                                       customer_customer_id bigint not null,
                                       notes character varying(255),
                                       foreign key (customer_customer_id) references public.customers (customer_id)
                                           match simple on update no action on delete no action
);


CREATE SEQUENCE if not exists emails_email_id_seq;
create table if not exists public.emails (
                                             email_id bigint primary key not null default nextval('emails_email_id_seq'::regclass),
                                             email_address character varying(255)
);


create table if not exists public.email_contact_bridge (
                                             email_id bigint not null,
                                             contact_id bigint not null,
                                             primary key (email_id, contact_id),
                                             foreign key (contact_id) references public.contacts (contact_id)
                                                 match simple on update no action on delete no action,
                                             foreign key (email_id) references public.emails (email_id)
                                                 match simple on update no action on delete no action
);


CREATE SEQUENCE if not exists professionals_professional_id_seq;
create table if not exists public.professionals (
                                                    professional_id bigint primary key not null default nextval('professionals_professional_id_seq'::regclass),
                                                    daily_rate real,
                                                    employment_state smallint,
                                                    location character varying(255),
                                                    contact_id bigint,
                                                    foreign key (contact_id) references public.contacts (contact_id)
                                                        match simple on update no action on delete no action
);

CREATE SEQUENCE if not exists job_offers_job_offer_id_seq;
create table if not exists public.job_offers (
                                                 job_offer_id bigint primary key not null default nextval('job_offers_job_offer_id_seq'::regclass),
                                                 description character varying(255),
                                                 details character varying(255),
                                                 duration bigint,
                                                 status smallint,
                                                 value real,
                                                 customer_customer_id bigint,
                                                 professional_professional_id bigint,
                                                 foreign key (professional_professional_id) references public.professionals (professional_id)
                                                     match simple on update no action on delete no action,
                                                 foreign key (customer_customer_id) references public.customers (customer_id)
                                                     match simple on update no action on delete no action
);

create table if not exists public.job_offer_required_skills (
                                                  job_offer_job_offer_id bigint not null,
                                                  required_skills character varying(255),
                                                  foreign key (job_offer_job_offer_id) references public.job_offers (job_offer_id)
                                                      match simple on update no action on delete no action
);


CREATE SEQUENCE if not exists job_offers_history_job_offer_history_id_seq;
create table if not exists public.job_offers_history (
                                           job_offer_history_id bigint primary key not null default nextval('job_offers_history_job_offer_history_id_seq'::regclass),
                                           date timestamp(6) without time zone,
                                           status smallint,
                                           note character varying(255),
                                           job_offer_job_offer_id bigint,
                                           foreign key (job_offer_job_offer_id) references public.job_offers (job_offer_id)
                                               match simple on update no action on delete no action
);

CREATE SEQUENCE if not exists messages_message_id_seq;
create table if not exists public.messages (
                                 message_id bigint primary key not null default nextval('messages_message_id_seq'::regclass),
                                 body oid,
                                 channel smallint,
                                 date character varying(255),
                                 priority integer,
                                 sender character varying(255),
                                 subject character varying(255)
);


CREATE SEQUENCE if not exists messages_history_message_history_id_seq;
create table if not exists public.messages_history (
                                         message_history_id bigint primary key not null default nextval('messages_history_message_history_id_seq'::regclass),
                                         comment character varying(255),
                                         date timestamp(6) without time zone,
                                         status smallint,
                                         message_message_id bigint,
                                         foreign key (message_message_id) references public.messages (message_id)
                                             match simple on update no action on delete no action
);

create table if not exists public.professional_skills (
                                            professional_professional_id bigint not null,
                                            skills character varying(255),
                                            foreign key (professional_professional_id) references public.professionals (professional_id)
                                                match simple on update no action on delete no action
);


CREATE SEQUENCE if not exists telephones_telephone_id_seq;
create table if not exists public.telephones (
                                                 telephone_id bigint primary key not null default nextval('telephones_telephone_id_seq'::regclass),
                                                 telephone_number character varying(255)
);

create unique index if not exists uk_ersc7taqbqoajjs0xaofgla0i on professionals using btree (contact_id);

create table if not exists public.telephone_contact_bridge (
                                                 telephone_id bigint not null,
                                                 contact_id bigint not null,
                                                 primary key (telephone_id, contact_id),
                                                 foreign key (contact_id) references public.contacts (contact_id)
                                                     match simple on update no action on delete no action,
                                                 foreign key (telephone_id) references public.telephones (telephone_id)
                                                     match simple on update no action on delete no action
);



