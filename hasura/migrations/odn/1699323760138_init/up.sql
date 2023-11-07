SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.all_auth_recipe_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    recipe_id character varying(128) NOT NULL,
    time_joined bigint NOT NULL
);
CREATE TABLE public.app_id_to_user_id (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    recipe_id character varying(128) NOT NULL
);
CREATE TABLE public.apps (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    created_at_time bigint
);
CREATE TABLE public.customers (
    id bigint NOT NULL,
    customer_id character varying NOT NULL,
    address text NOT NULL,
    service character varying NOT NULL,
    power_signal character varying NOT NULL,
    modem_serial_number character varying NOT NULL,
    port character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    hardware_installation_id character varying
);
COMMENT ON TABLE public.customers IS 'The table holds customer data with port number attach into it';
CREATE SEQUENCE public.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;
CREATE TABLE public.dashboard_user_sessions (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    session_id character(36) NOT NULL,
    user_id character(36) NOT NULL,
    time_created bigint NOT NULL,
    expiry bigint NOT NULL
);
CREATE TABLE public.dashboard_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256) NOT NULL,
    password_hash character varying(256) NOT NULL,
    time_joined bigint NOT NULL
);
CREATE TABLE public.emailpassword_pswd_reset_tokens (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    token character varying(128) NOT NULL,
    token_expiry bigint NOT NULL
);
CREATE TABLE public.emailpassword_user_to_tenant (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256) NOT NULL
);
CREATE TABLE public.emailpassword_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256) NOT NULL,
    password_hash character varying(256) NOT NULL,
    time_joined bigint NOT NULL
);
CREATE TABLE public.emailverification_tokens (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    email character varying(256) NOT NULL,
    token character varying(128) NOT NULL,
    token_expiry bigint NOT NULL
);
CREATE TABLE public.emailverification_verified_emails (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    email character varying(256) NOT NULL
);
CREATE TABLE public.files (
    id bigint NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    serial_number_id bigint NOT NULL
);
CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
CREATE TABLE public.generated_serial_numbers (
    id bigint NOT NULL,
    code character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    serial_number_id bigint NOT NULL,
    created_by bigint
);
CREATE SEQUENCE public.generated_serial_numbers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.generated_serial_numbers_id_seq OWNED BY public.generated_serial_numbers.id;
CREATE TABLE public.hardware_installations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    hardware_installation_id character varying,
    product_serial_id bigint
);
CREATE SEQUENCE public.hardware_installations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.hardware_installations_id_seq OWNED BY public.hardware_installations.id;
CREATE TABLE public.jwt_signing_keys (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    key_id character varying(255) NOT NULL,
    key_string text NOT NULL,
    algorithm character varying(10) NOT NULL,
    created_at bigint
);
CREATE TABLE public.key_value (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    name character varying(128) NOT NULL,
    value text,
    created_at_time bigint
);
CREATE TABLE public.passwordless_codes (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    code_id character(36) NOT NULL,
    device_id_hash character(44) NOT NULL,
    link_code_hash character(44) NOT NULL,
    created_at bigint NOT NULL
);
CREATE TABLE public.passwordless_devices (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    device_id_hash character(44) NOT NULL,
    email character varying(256),
    phone_number character varying(256),
    link_code_salt character(44) NOT NULL,
    failed_attempts integer NOT NULL
);
CREATE TABLE public.passwordless_user_to_tenant (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256),
    phone_number character varying(256)
);
CREATE TABLE public.passwordless_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256),
    phone_number character varying(256),
    time_joined bigint NOT NULL
);
CREATE TABLE public.product_serials (
    id bigint NOT NULL,
    serial_number character varying NOT NULL,
    capacity bigint,
    optical_power character varying,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    product_id bigint NOT NULL,
    capacity_remaining bigint,
    installed_at timestamp with time zone,
    longitude character varying,
    latitude character varying,
    attachment character varying,
    port_id bigint,
    central_office character varying,
    created_by bigint
);
CREATE SEQUENCE public.product_serials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.product_serials_id_seq OWNED BY public.product_serials.id;
CREATE TABLE public.products (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    shorten_name character varying,
    created_by bigint
);
CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
CREATE TABLE public.role_permissions (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    role character varying(255) NOT NULL,
    permission character varying(255) NOT NULL
);
CREATE TABLE public.roles (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    role character varying(255) NOT NULL
);
CREATE TABLE public.serial_numbers (
    id bigint NOT NULL,
    product_order_id character varying NOT NULL,
    quantity bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    product_name character varying,
    product_id bigint,
    status boolean DEFAULT false,
    verification boolean DEFAULT false,
    created_by bigint
);
CREATE SEQUENCE public.serial_numbers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.serial_numbers_id_seq OWNED BY public.serial_numbers.id;
CREATE TABLE public.session_access_token_signing_keys (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    created_at_time bigint NOT NULL,
    value text
);
CREATE TABLE public.session_info (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    session_handle character varying(255) NOT NULL,
    user_id character varying(128) NOT NULL,
    refresh_token_hash_2 character varying(128) NOT NULL,
    session_data text,
    expires_at bigint NOT NULL,
    created_at_time bigint NOT NULL,
    jwt_user_payload text,
    use_static_key boolean NOT NULL
);
CREATE TABLE public.teams (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;
CREATE TABLE public.tenant_configs (
    connection_uri_domain character varying(256) DEFAULT ''::character varying NOT NULL,
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    core_config text,
    email_password_enabled boolean,
    passwordless_enabled boolean,
    third_party_enabled boolean
);
CREATE TABLE public.tenant_thirdparty_provider_clients (
    connection_uri_domain character varying(256) DEFAULT ''::character varying NOT NULL,
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    third_party_id character varying(28) NOT NULL,
    client_type character varying(64) DEFAULT ''::character varying NOT NULL,
    client_id character varying(256) NOT NULL,
    client_secret text,
    scope character varying(128)[],
    force_pkce boolean,
    additional_config text
);
CREATE TABLE public.tenant_thirdparty_providers (
    connection_uri_domain character varying(256) DEFAULT ''::character varying NOT NULL,
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    third_party_id character varying(28) NOT NULL,
    name character varying(64),
    authorization_endpoint text,
    authorization_endpoint_query_params text,
    token_endpoint text,
    token_endpoint_body_params text,
    user_info_endpoint text,
    user_info_endpoint_query_params text,
    user_info_endpoint_headers text,
    jwks_uri text,
    oidc_discovery_endpoint text,
    require_email boolean,
    user_info_map_from_id_token_payload_user_id character varying(64),
    user_info_map_from_id_token_payload_email character varying(64),
    user_info_map_from_id_token_payload_email_verified character varying(64),
    user_info_map_from_user_info_endpoint_user_id character varying(64),
    user_info_map_from_user_info_endpoint_email character varying(64),
    user_info_map_from_user_info_endpoint_email_verified character varying(64)
);
CREATE TABLE public.tenants (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    created_at_time bigint
);
CREATE TABLE public.thirdparty_user_to_tenant (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character(36) NOT NULL,
    third_party_id character varying(28) NOT NULL,
    third_party_user_id character varying(256) NOT NULL
);
CREATE TABLE public.thirdparty_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    third_party_id character varying(28) NOT NULL,
    third_party_user_id character varying(256) NOT NULL,
    user_id character(36) NOT NULL,
    email character varying(256) NOT NULL,
    time_joined bigint NOT NULL
);
CREATE TABLE public.totp_used_codes (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    code character varying(8) NOT NULL,
    is_valid boolean NOT NULL,
    expiry_time_ms bigint NOT NULL,
    created_time_ms bigint NOT NULL
);
CREATE TABLE public.totp_user_devices (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    device_name character varying(256) NOT NULL,
    secret_key character varying(256) NOT NULL,
    period integer NOT NULL,
    skew integer NOT NULL,
    verified boolean NOT NULL
);
CREATE TABLE public.totp_users (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL
);
CREATE TABLE public.user_last_active (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    last_active_time bigint
);
CREATE TABLE public.user_metadata (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    user_metadata text NOT NULL
);
CREATE TABLE public.user_roles (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    tenant_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    user_id character varying(128) NOT NULL,
    role character varying(255) NOT NULL
);
CREATE TABLE public.userid_mapping (
    app_id character varying(64) DEFAULT 'public'::character varying NOT NULL,
    supertokens_user_id character(36) NOT NULL,
    external_user_id character varying(128) NOT NULL,
    external_user_id_info text
);
CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying NOT NULL,
    role character varying,
    email character varying NOT NULL,
    phone character varying,
    team_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username character varying,
    company character varying,
    reference text,
    serial_numbers_remaining integer
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);
ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
ALTER TABLE ONLY public.generated_serial_numbers ALTER COLUMN id SET DEFAULT nextval('public.generated_serial_numbers_id_seq'::regclass);
ALTER TABLE ONLY public.hardware_installations ALTER COLUMN id SET DEFAULT nextval('public.hardware_installations_id_seq'::regclass);
ALTER TABLE ONLY public.product_serials ALTER COLUMN id SET DEFAULT nextval('public.product_serials_id_seq'::regclass);
ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
ALTER TABLE ONLY public.serial_numbers ALTER COLUMN id SET DEFAULT nextval('public.serial_numbers_id_seq'::regclass);
ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.all_auth_recipe_users
    ADD CONSTRAINT all_auth_recipe_users_pkey PRIMARY KEY (app_id, tenant_id, user_id);
ALTER TABLE ONLY public.app_id_to_user_id
    ADD CONSTRAINT app_id_to_user_id_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.apps
    ADD CONSTRAINT apps_pkey PRIMARY KEY (app_id);
ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.dashboard_user_sessions
    ADD CONSTRAINT dashboard_user_sessions_pkey PRIMARY KEY (app_id, session_id);
ALTER TABLE ONLY public.dashboard_users
    ADD CONSTRAINT dashboard_users_email_key UNIQUE (app_id, email);
ALTER TABLE ONLY public.dashboard_users
    ADD CONSTRAINT dashboard_users_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.emailpassword_pswd_reset_tokens
    ADD CONSTRAINT emailpassword_pswd_reset_tokens_pkey PRIMARY KEY (app_id, user_id, token);
ALTER TABLE ONLY public.emailpassword_pswd_reset_tokens
    ADD CONSTRAINT emailpassword_pswd_reset_tokens_token_key UNIQUE (token);
ALTER TABLE ONLY public.emailpassword_user_to_tenant
    ADD CONSTRAINT emailpassword_user_to_tenant_email_key UNIQUE (app_id, tenant_id, email);
ALTER TABLE ONLY public.emailpassword_user_to_tenant
    ADD CONSTRAINT emailpassword_user_to_tenant_pkey PRIMARY KEY (app_id, tenant_id, user_id);
ALTER TABLE ONLY public.emailpassword_users
    ADD CONSTRAINT emailpassword_users_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.emailverification_tokens
    ADD CONSTRAINT emailverification_tokens_pkey PRIMARY KEY (app_id, tenant_id, user_id, email, token);
ALTER TABLE ONLY public.emailverification_tokens
    ADD CONSTRAINT emailverification_tokens_token_key UNIQUE (token);
ALTER TABLE ONLY public.emailverification_verified_emails
    ADD CONSTRAINT emailverification_verified_emails_pkey PRIMARY KEY (app_id, user_id, email);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.generated_serial_numbers
    ADD CONSTRAINT generated_serial_numbers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.hardware_installations
    ADD CONSTRAINT hardware_installations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.hardware_installations
    ADD CONSTRAINT hardware_installations_product_serial_id_key UNIQUE (product_serial_id);
ALTER TABLE ONLY public.jwt_signing_keys
    ADD CONSTRAINT jwt_signing_keys_pkey PRIMARY KEY (app_id, key_id);
ALTER TABLE ONLY public.key_value
    ADD CONSTRAINT key_value_pkey PRIMARY KEY (app_id, tenant_id, name);
ALTER TABLE ONLY public.passwordless_codes
    ADD CONSTRAINT passwordless_codes_link_code_hash_key UNIQUE (app_id, tenant_id, link_code_hash);
ALTER TABLE ONLY public.passwordless_codes
    ADD CONSTRAINT passwordless_codes_pkey PRIMARY KEY (app_id, tenant_id, code_id);
ALTER TABLE ONLY public.passwordless_devices
    ADD CONSTRAINT passwordless_devices_pkey PRIMARY KEY (app_id, tenant_id, device_id_hash);
ALTER TABLE ONLY public.passwordless_user_to_tenant
    ADD CONSTRAINT passwordless_user_to_tenant_email_key UNIQUE (app_id, tenant_id, email);
ALTER TABLE ONLY public.passwordless_user_to_tenant
    ADD CONSTRAINT passwordless_user_to_tenant_phone_number_key UNIQUE (app_id, tenant_id, phone_number);
ALTER TABLE ONLY public.passwordless_user_to_tenant
    ADD CONSTRAINT passwordless_user_to_tenant_pkey PRIMARY KEY (app_id, tenant_id, user_id);
ALTER TABLE ONLY public.passwordless_users
    ADD CONSTRAINT passwordless_users_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.product_serials
    ADD CONSTRAINT product_serials_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (app_id, role, permission);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (app_id, role);
ALTER TABLE ONLY public.serial_numbers
    ADD CONSTRAINT serial_numbers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.session_access_token_signing_keys
    ADD CONSTRAINT session_access_token_signing_keys_pkey PRIMARY KEY (app_id, created_at_time);
ALTER TABLE ONLY public.session_info
    ADD CONSTRAINT session_info_pkey PRIMARY KEY (app_id, tenant_id, session_handle);
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tenant_configs
    ADD CONSTRAINT tenant_configs_pkey PRIMARY KEY (connection_uri_domain, app_id, tenant_id);
ALTER TABLE ONLY public.tenant_thirdparty_provider_clients
    ADD CONSTRAINT tenant_thirdparty_provider_clients_pkey PRIMARY KEY (connection_uri_domain, app_id, tenant_id, third_party_id, client_type);
ALTER TABLE ONLY public.tenant_thirdparty_providers
    ADD CONSTRAINT tenant_thirdparty_providers_pkey PRIMARY KEY (connection_uri_domain, app_id, tenant_id, third_party_id);
ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (app_id, tenant_id);
ALTER TABLE ONLY public.thirdparty_user_to_tenant
    ADD CONSTRAINT thirdparty_user_to_tenant_pkey PRIMARY KEY (app_id, tenant_id, user_id);
ALTER TABLE ONLY public.thirdparty_user_to_tenant
    ADD CONSTRAINT thirdparty_user_to_tenant_third_party_user_id_key UNIQUE (app_id, tenant_id, third_party_id, third_party_user_id);
ALTER TABLE ONLY public.thirdparty_users
    ADD CONSTRAINT thirdparty_users_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.totp_used_codes
    ADD CONSTRAINT totp_used_codes_pkey PRIMARY KEY (app_id, tenant_id, user_id, created_time_ms);
ALTER TABLE ONLY public.totp_user_devices
    ADD CONSTRAINT totp_user_devices_pkey PRIMARY KEY (app_id, user_id, device_name);
ALTER TABLE ONLY public.totp_users
    ADD CONSTRAINT totp_users_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.user_last_active
    ADD CONSTRAINT user_last_active_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.user_metadata
    ADD CONSTRAINT user_metadata_pkey PRIMARY KEY (app_id, user_id);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (app_id, tenant_id, user_id, role);
ALTER TABLE ONLY public.userid_mapping
    ADD CONSTRAINT userid_mapping_external_user_id_key UNIQUE (app_id, external_user_id);
ALTER TABLE ONLY public.userid_mapping
    ADD CONSTRAINT userid_mapping_pkey PRIMARY KEY (app_id, supertokens_user_id, external_user_id);
ALTER TABLE ONLY public.userid_mapping
    ADD CONSTRAINT userid_mapping_supertokens_user_id_key UNIQUE (app_id, supertokens_user_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE INDEX access_token_signing_keys_app_id_index ON public.session_access_token_signing_keys USING btree (app_id);
CREATE INDEX all_auth_recipe_tenant_id_index ON public.all_auth_recipe_users USING btree (app_id, tenant_id);
CREATE INDEX all_auth_recipe_user_id_index ON public.all_auth_recipe_users USING btree (app_id, user_id);
CREATE INDEX all_auth_recipe_users_pagination_index ON public.all_auth_recipe_users USING btree (time_joined DESC, user_id DESC, tenant_id DESC, app_id DESC);
CREATE INDEX app_id_to_user_id_app_id_index ON public.app_id_to_user_id USING btree (app_id);
CREATE INDEX dashboard_user_sessions_expiry_index ON public.dashboard_user_sessions USING btree (expiry);
CREATE INDEX dashboard_user_sessions_user_id_index ON public.dashboard_user_sessions USING btree (app_id, user_id);
CREATE INDEX dashboard_users_app_id_index ON public.dashboard_users USING btree (app_id);
CREATE INDEX emailpassword_password_reset_token_expiry_index ON public.emailpassword_pswd_reset_tokens USING btree (token_expiry);
CREATE INDEX emailpassword_pswd_reset_tokens_user_id_index ON public.emailpassword_pswd_reset_tokens USING btree (app_id, user_id);
CREATE INDEX emailverification_tokens_index ON public.emailverification_tokens USING btree (token_expiry);
CREATE INDEX emailverification_tokens_tenant_id_index ON public.emailverification_tokens USING btree (app_id, tenant_id);
CREATE INDEX emailverification_verified_emails_app_id_index ON public.emailverification_verified_emails USING btree (app_id);
CREATE INDEX jwt_signing_keys_app_id_index ON public.jwt_signing_keys USING btree (app_id);
CREATE INDEX key_value_tenant_id_index ON public.key_value USING btree (app_id, tenant_id);
CREATE INDEX passwordless_codes_created_at_index ON public.passwordless_codes USING btree (app_id, tenant_id, created_at);
CREATE INDEX passwordless_codes_device_id_hash_index ON public.passwordless_codes USING btree (app_id, tenant_id, device_id_hash);
CREATE INDEX passwordless_devices_email_index ON public.passwordless_devices USING btree (app_id, tenant_id, email);
CREATE INDEX passwordless_devices_phone_number_index ON public.passwordless_devices USING btree (app_id, tenant_id, phone_number);
CREATE INDEX passwordless_devices_tenant_id_index ON public.passwordless_devices USING btree (app_id, tenant_id);
CREATE INDEX role_permissions_permission_index ON public.role_permissions USING btree (app_id, permission);
CREATE INDEX role_permissions_role_index ON public.role_permissions USING btree (app_id, role);
CREATE INDEX roles_app_id_index ON public.roles USING btree (app_id);
CREATE INDEX session_expiry_index ON public.session_info USING btree (expires_at);
CREATE INDEX session_info_tenant_id_index ON public.session_info USING btree (app_id, tenant_id);
CREATE INDEX tenant_thirdparty_provider_clients_third_party_id_index ON public.tenant_thirdparty_provider_clients USING btree (connection_uri_domain, app_id, tenant_id, third_party_id);
CREATE INDEX tenant_thirdparty_providers_tenant_id_index ON public.tenant_thirdparty_providers USING btree (connection_uri_domain, app_id, tenant_id);
CREATE INDEX tenants_app_id_index ON public.tenants USING btree (app_id);
CREATE INDEX thirdparty_users_email_index ON public.thirdparty_users USING btree (app_id, email);
CREATE INDEX thirdparty_users_thirdparty_user_id_index ON public.thirdparty_users USING btree (app_id, third_party_id, third_party_user_id);
CREATE INDEX totp_used_codes_expiry_time_ms_index ON public.totp_used_codes USING btree (app_id, tenant_id, expiry_time_ms);
CREATE INDEX totp_used_codes_tenant_id_index ON public.totp_used_codes USING btree (app_id, tenant_id);
CREATE INDEX totp_used_codes_user_id_index ON public.totp_used_codes USING btree (app_id, user_id);
CREATE INDEX totp_user_devices_user_id_index ON public.totp_user_devices USING btree (app_id, user_id);
CREATE INDEX totp_users_app_id_index ON public.totp_users USING btree (app_id);
CREATE INDEX user_last_active_app_id_index ON public.user_last_active USING btree (app_id);
CREATE INDEX user_metadata_app_id_index ON public.user_metadata USING btree (app_id);
CREATE INDEX user_roles_app_id_role_index ON public.user_roles USING btree (app_id, role);
CREATE INDEX user_roles_role_index ON public.user_roles USING btree (app_id, tenant_id, role);
CREATE INDEX user_roles_tenant_id_index ON public.user_roles USING btree (app_id, tenant_id);
CREATE INDEX userid_mapping_supertokens_user_id_index ON public.userid_mapping USING btree (app_id, supertokens_user_id);
CREATE TRIGGER set_public_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_customers_updated_at ON public.customers IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_files_updated_at BEFORE UPDATE ON public.files FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_files_updated_at ON public.files IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_generated_serial_numbers_updated_at BEFORE UPDATE ON public.generated_serial_numbers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_generated_serial_numbers_updated_at ON public.generated_serial_numbers IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_hardware_installations_updated_at BEFORE UPDATE ON public.hardware_installations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_hardware_installations_updated_at ON public.hardware_installations IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_product_serials_updated_at BEFORE UPDATE ON public.product_serials FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_product_serials_updated_at ON public.product_serials IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_products_updated_at ON public.products IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_serial_numbers_updated_at BEFORE UPDATE ON public.serial_numbers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_serial_numbers_updated_at ON public.serial_numbers IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_teams_updated_at ON public.teams IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.all_auth_recipe_users
    ADD CONSTRAINT all_auth_recipe_users_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.all_auth_recipe_users
    ADD CONSTRAINT all_auth_recipe_users_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.app_id_to_user_id(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.app_id_to_user_id
    ADD CONSTRAINT app_id_to_user_id_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.dashboard_user_sessions
    ADD CONSTRAINT dashboard_user_sessions_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.dashboard_users(app_id, user_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.dashboard_users
    ADD CONSTRAINT dashboard_users_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.emailpassword_pswd_reset_tokens
    ADD CONSTRAINT emailpassword_pswd_reset_tokens_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.emailpassword_users(app_id, user_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.emailpassword_user_to_tenant
    ADD CONSTRAINT emailpassword_user_to_tenant_user_id_fkey FOREIGN KEY (app_id, tenant_id, user_id) REFERENCES public.all_auth_recipe_users(app_id, tenant_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.emailpassword_users
    ADD CONSTRAINT emailpassword_users_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.app_id_to_user_id(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.emailverification_tokens
    ADD CONSTRAINT emailverification_tokens_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.emailverification_verified_emails
    ADD CONSTRAINT emailverification_verified_emails_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_serial_number_id_fkey FOREIGN KEY (serial_number_id) REFERENCES public.serial_numbers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.generated_serial_numbers
    ADD CONSTRAINT generated_serial_numbers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.generated_serial_numbers
    ADD CONSTRAINT generated_serial_numbers_serial_number_id_fkey FOREIGN KEY (serial_number_id) REFERENCES public.serial_numbers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.hardware_installations
    ADD CONSTRAINT hardware_installations_product_serial_id_fkey FOREIGN KEY (product_serial_id) REFERENCES public.product_serials(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.jwt_signing_keys
    ADD CONSTRAINT jwt_signing_keys_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.key_value
    ADD CONSTRAINT key_value_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.passwordless_codes
    ADD CONSTRAINT passwordless_codes_device_id_hash_fkey FOREIGN KEY (app_id, tenant_id, device_id_hash) REFERENCES public.passwordless_devices(app_id, tenant_id, device_id_hash) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.passwordless_devices
    ADD CONSTRAINT passwordless_devices_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.passwordless_user_to_tenant
    ADD CONSTRAINT passwordless_user_to_tenant_user_id_fkey FOREIGN KEY (app_id, tenant_id, user_id) REFERENCES public.all_auth_recipe_users(app_id, tenant_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.passwordless_users
    ADD CONSTRAINT passwordless_users_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.app_id_to_user_id(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.product_serials
    ADD CONSTRAINT product_serials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.product_serials
    ADD CONSTRAINT product_serials_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_fkey FOREIGN KEY (app_id, role) REFERENCES public.roles(app_id, role) ON DELETE CASCADE;
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.serial_numbers
    ADD CONSTRAINT serial_numbers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.session_access_token_signing_keys
    ADD CONSTRAINT session_access_token_signing_keys_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.session_info
    ADD CONSTRAINT session_info_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tenant_thirdparty_provider_clients
    ADD CONSTRAINT tenant_thirdparty_provider_clients_third_party_id_fkey FOREIGN KEY (connection_uri_domain, app_id, tenant_id, third_party_id) REFERENCES public.tenant_thirdparty_providers(connection_uri_domain, app_id, tenant_id, third_party_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tenant_thirdparty_providers
    ADD CONSTRAINT tenant_thirdparty_providers_tenant_id_fkey FOREIGN KEY (connection_uri_domain, app_id, tenant_id) REFERENCES public.tenant_configs(connection_uri_domain, app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.thirdparty_user_to_tenant
    ADD CONSTRAINT thirdparty_user_to_tenant_user_id_fkey FOREIGN KEY (app_id, tenant_id, user_id) REFERENCES public.all_auth_recipe_users(app_id, tenant_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.thirdparty_users
    ADD CONSTRAINT thirdparty_users_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.app_id_to_user_id(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.totp_used_codes
    ADD CONSTRAINT totp_used_codes_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.totp_used_codes
    ADD CONSTRAINT totp_used_codes_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.totp_users(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.totp_user_devices
    ADD CONSTRAINT totp_user_devices_user_id_fkey FOREIGN KEY (app_id, user_id) REFERENCES public.totp_users(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.totp_users
    ADD CONSTRAINT totp_users_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_last_active
    ADD CONSTRAINT user_last_active_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_metadata
    ADD CONSTRAINT user_metadata_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(app_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_fkey FOREIGN KEY (app_id, role) REFERENCES public.roles(app_id, role) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_tenant_id_fkey FOREIGN KEY (app_id, tenant_id) REFERENCES public.tenants(app_id, tenant_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.userid_mapping
    ADD CONSTRAINT userid_mapping_supertokens_user_id_fkey FOREIGN KEY (app_id, supertokens_user_id) REFERENCES public.app_id_to_user_id(app_id, user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
