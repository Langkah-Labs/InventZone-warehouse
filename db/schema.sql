CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$function$
;

-- public.customers definition

-- Drop table

-- DROP TABLE public.customers;

CREATE TABLE public.customers (
	id bigserial NOT NULL,
	customer_id varchar NOT NULL,
	address text NOT NULL,
	service varchar NOT NULL,
	power_signal varchar NOT NULL,
	modem_serial_number varchar NOT NULL,
	port varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	hardware_installation_id varchar NULL,
	CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger set_public_customers_updated_at before
update
    on
    public.customers for each row execute function set_current_timestamp_updated_at();


-- public.teams definition

-- Drop table

-- DROP TABLE public.teams;

CREATE TABLE public.teams (
	id bigserial NOT NULL,
	"name" varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT teams_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger set_public_teams_updated_at before
update
    on
    public.teams for each row execute function set_current_timestamp_updated_at();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial NOT NULL,
	"name" varchar NOT NULL,
	"role" varchar NULL,
	email varchar NOT NULL,
	phone varchar NULL,
	team_id int8 NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	username varchar NULL,
	company varchar NULL,
	reference text NULL,
	serial_numbers_remaining int4 NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_users_updated_at before
update
    on
    public.users for each row execute function set_current_timestamp_updated_at();


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id bigserial NOT NULL,
	"name" varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	description text NULL,
	shorten_name varchar NULL,
	created_by int8 NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_products_updated_at before
update
    on
    public.products for each row execute function set_current_timestamp_updated_at();


-- public.serial_numbers definition

-- Drop table

-- DROP TABLE public.serial_numbers;

CREATE TABLE public.serial_numbers (
	id bigserial NOT NULL,
	product_order_id varchar NOT NULL,
	quantity int8 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	product_name varchar NULL,
	product_id int8 NULL,
	status bool NULL DEFAULT false,
	verification bool NULL DEFAULT false,
	created_by int8 NULL,
	CONSTRAINT serial_numbers_pkey PRIMARY KEY (id),
	CONSTRAINT serial_numbers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_serial_numbers_updated_at before
update
    on
    public.serial_numbers for each row execute function set_current_timestamp_updated_at();


-- public.files definition

-- Drop table

-- DROP TABLE public.files;

CREATE TABLE public.files (
	id bigserial NOT NULL,
	url text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	serial_number_id int8 NOT NULL,
	CONSTRAINT files_pkey PRIMARY KEY (id),
	CONSTRAINT files_serial_number_id_fkey FOREIGN KEY (serial_number_id) REFERENCES public.serial_numbers(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_files_updated_at before
update
    on
    public.files for each row execute function set_current_timestamp_updated_at();


-- public.generated_serial_numbers definition

-- Drop table

-- DROP TABLE public.generated_serial_numbers;

CREATE TABLE public.generated_serial_numbers (
	id bigserial NOT NULL,
	code varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	serial_number_id int8 NOT NULL,
	created_by int8 NULL,
	CONSTRAINT generated_serial_numbers_pkey PRIMARY KEY (id),
	CONSTRAINT generated_serial_numbers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT generated_serial_numbers_serial_number_id_fkey FOREIGN KEY (serial_number_id) REFERENCES public.serial_numbers(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_generated_serial_numbers_updated_at before
update
    on
    public.generated_serial_numbers for each row execute function set_current_timestamp_updated_at();


-- public.product_serials definition

-- Drop table

-- DROP TABLE public.product_serials;

CREATE TABLE public.product_serials (
	id bigserial NOT NULL,
	serial_number varchar NOT NULL,
	capacity int8 NULL,
	optical_power varchar NULL,
	description text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	product_id int8 NOT NULL,
	capacity_remaining int8 NULL,
	installed_at timestamptz NULL,
	longitude varchar NULL,
	latitude varchar NULL,
	attachment varchar NULL,
	port_id int8 NULL,
	central_office varchar NULL,
	created_by int8 NULL,
	CONSTRAINT product_serials_pkey PRIMARY KEY (id),
	CONSTRAINT product_serials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT product_serials_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_product_serials_updated_at before
update
    on
    public.product_serials for each row execute function set_current_timestamp_updated_at();


-- public.hardware_installations definition

-- Drop table

-- DROP TABLE public.hardware_installations;

CREATE TABLE public.hardware_installations (
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	hardware_installation_id varchar NULL,
	product_serial_id int8 NULL,
	CONSTRAINT hardware_installations_pkey PRIMARY KEY (id),
	CONSTRAINT hardware_installations_product_serial_id_key UNIQUE (product_serial_id),
	CONSTRAINT hardware_installations_product_serial_id_fkey FOREIGN KEY (product_serial_id) REFERENCES public.product_serials(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Table Triggers

create trigger set_public_hardware_installations_updated_at before
update
    on
    public.hardware_installations for each row execute function set_current_timestamp_updated_at();