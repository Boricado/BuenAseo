--
-- PostgreSQL database dump
--

\restrict Pg7QwudHfmI1D4VSfrZBhurF0rcMG7hfSJLbyP14OM0LPYlbyDf2R4SjdldgZIt

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-01-27 16:56:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "buenAseo";
--
-- TOC entry 4972 (class 1262 OID 24737)
-- Name: buenAseo; Type: DATABASE; Schema: -; Owner: postgres
--




ALTER DATABASE "buenAseo" OWNER TO postgres;

\unrestrict Pg7QwudHfmI1D4VSfrZBhurF0rcMG7hfSJLbyP14OM0LPYlbyDf2R4SjdldgZIt

\restrict Pg7QwudHfmI1D4VSfrZBhurF0rcMG7hfSJLbyP14OM0LPYlbyDf2R4SjdldgZIt

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 24922)
-- Name: carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    item_id character varying(50) NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    tipo character varying(20) NOT NULL,
    agregado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carrito OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24921)
-- Name: carrito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrito_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 224
-- Name: carrito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_id_seq OWNED BY public.carrito.id;


--
-- TOC entry 220 (class 1259 OID 24850)
-- Name: compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compras (
    id integer NOT NULL,
    usuario_id integer,
    producto character varying(255) NOT NULL,
    cantidad integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.compras OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24849)
-- Name: compras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compras_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 219
-- Name: compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compras_id_seq OWNED BY public.compras.id;


--
-- TOC entry 222 (class 1259 OID 24887)
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    usuario_id integer NOT NULL,
    item_id character varying(50)
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24879)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion text,
    stock integer DEFAULT 0,
    imagen_url text
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24914)
-- Name: servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios (
    id character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion text,
    imagen_url text
);


ALTER TABLE public.servicios OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24832)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100),
    direccion text,
    telefono character varying(20),
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'Cliente'::character varying NOT NULL,
    picture text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24831)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 227 (class 1259 OID 24938)
-- Name: ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventas (
    id integer NOT NULL,
    usuario_id integer,
    nombre_cliente character varying(100),
    direccion character varying(255),
    metodo_pago character varying(50),
    total integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying
);


ALTER TABLE public.ventas OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24951)
-- Name: ventas_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventas_detalle (
    id integer NOT NULL,
    venta_id integer,
    item_id character varying(50),
    cantidad integer,
    precio_unitario integer
);


ALTER TABLE public.ventas_detalle OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24950)
-- Name: ventas_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventas_detalle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 228
-- Name: ventas_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_detalle_id_seq OWNED BY public.ventas_detalle.id;


--
-- TOC entry 226 (class 1259 OID 24937)
-- Name: ventas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 226
-- Name: ventas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_id_seq OWNED BY public.ventas.id;


--
-- TOC entry 4780 (class 2604 OID 24925)
-- Name: carrito id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito ALTER COLUMN id SET DEFAULT nextval('public.carrito_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 24853)
-- Name: compras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras ALTER COLUMN id SET DEFAULT nextval('public.compras_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 24835)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 24941)
-- Name: ventas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id SET DEFAULT nextval('public.ventas_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 24954)
-- Name: ventas_detalle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas_detalle ALTER COLUMN id SET DEFAULT nextval('public.ventas_detalle_id_seq'::regclass);


--
-- TOC entry 4962 (class 0 OID 24922)
-- Dependencies: 225
-- Data for Name: carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito (id, usuario_id, item_id, cantidad, tipo, agregado_en) FROM stdin;
\.


--
-- TOC entry 4957 (class 0 OID 24850)
-- Dependencies: 220
-- Data for Name: compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras (id, usuario_id, producto, cantidad, precio, fecha) FROM stdin;
\.


--
-- TOC entry 4959 (class 0 OID 24887)
-- Dependencies: 222
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favoritos (usuario_id, item_id) FROM stdin;
9	\N
9	SVC-2D2B
9	PRD-SABANAS-1P
9	PRD-ALMOHADA
9	PRD-TOALLA-MANO
9	PRD-PLUMON-1P
\.


--
-- TOC entry 4958 (class 0 OID 24879)
-- Dependencies: 221
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, nombre, precio, descripcion, stock, imagen_url) FROM stdin;
PRD-SABANAS-2P	Juego de sábanas 2 plazas	22000.00	Juego de sábanas calidad hotelera, 180 hilos, ideal para arriendos tipo Airbnb.	10	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/21935/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-SABANAS-2P-PREMIUM	Juego de sábanas 2 plazas premium	28000.00	Juego de sábanas 200–220 hilos, mayor suavidad y durabilidad.	8	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/20726/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-PLUMON-1P	Plumón 1 plaza	30000.00	Plumón sintético uso todo año, fácil lavado.	6	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/22782/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-PLUMON-2P	Plumón 2 plazas	35000.00	Plumón sintético uso todo año, recomendado para arriendos.	6	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/15433/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-ALMOHADA	Almohada hotelera	20000.00	Almohada firme, uso hotelero, alta durabilidad.	20	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/460/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-TOALLA-BANO	Toalla de baño	8000.00	Toalla de algodón, gramaje medio, uso hotelero.	30	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/19961/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-TOALLA-MANO	Toalla de mano	4000.00	Toalla de mano de algodón, a juego con toalla de baño.	30	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/6332/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-SABANAS-1P	Juego de sábanas 1 plaza	18000.00	Juego de sábanas calidad hotelera, 180 hilos, resistente a lavados frecuentes.	12	https://cdnimg.retailrocket.net/api/1.0/partner/6217fd2c97a5250c4449ca17/item/20693/picture/?format=jpg&width=1500&height=1500&scale=both
PRD-test		3000.00	\N	1000	\N
\.


--
-- TOC entry 4960 (class 0 OID 24914)
-- Dependencies: 223
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios (id, nombre, precio, descripcion, imagen_url) FROM stdin;
SVC-2D2B	Limpieza departamento 2D 2B	45000.00	Limpieza estándar hasta 4 horas. Incluye cocina completa, baños sanitizados...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWUlYSIQ6ZohqwVJQtzRdPvgbWKuhA4Dy-og&s
SVC-3D1B	Limpieza departamento 3D 1B	45000.00	Limpieza estándar hasta 4 horas. Incluye cambio de sábanas, cocina completa...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzhlsWBP7kxJXWBUzb-QwOz3FTYCSBOaFO6A&s
SVC-3D2B	Limpieza departamento 3D 2B	50000.00	Limpieza estándar hasta 4 horas. Incluye cocina completa, baños sanitizados...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNlTMY-dOXwnIDSF_1Sygk2AVGg9Jr-KGjqg&s
SVC-PROFUNDA	Limpieza profunda de departamento	100000.00	Limpieza profunda integral. Incluye desengrase de cocina, campana, horno y refrigerador...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj3vVn2-v0AFq4ElTKNTcbfFwC2rBEJRqiqg&s
SVC-1D1B	Limpieza departamento 1D 1B	35000.00	Limpieza estándar hasta 4 horas. Incluye cambio de sábanas, cocina completa...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWUlYSIQ6ZohqwVJQtzRdPvgbWKuhA4Dy-og&s
SVC-2D1B	Limpieza departamento 2D 1B	40000.00	Limpieza estándar hasta 4 horas. Incluye cambio de sábanas, cocina completa...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWUlYSIQ6ZohqwVJQtzRdPvgbWKuhA4Dy-og&s
SVC-3D3B	Limpieza departamento 3D 3B	55000.00	Limpieza estándar hasta 4 horas. Incluye sábanas, cocina y baños...	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWUlYSIQ6ZohqwVJQtzRdPvgbWKuhA4Dy-og&s
\.


--
-- TOC entry 4955 (class 0 OID 24832)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, direccion, telefono, email, password_hash, rol, picture, created_at) FROM stdin;
7	test 4			hi@hi.com	$2b$10$p.Wq2ghZOOLkzDMLGc5hT.jiJo5DpIID.4twwlKXFxIjOkAkj05aK	Cliente	\N	2026-01-17 13:39:04.883493
10	Test	er		test@test.com	$2b$10$JZRc.G3FjIz4zUmgAPtXkeiDxKS5Dvb1mjfgwGJ3R0tv8G0ru1iQ2	Cliente	\N	2026-01-22 13:15:58.180547
9	Fidel mora	golsss	21515	hola@hola.com	$2b$10$Qsu/8DKrGKqI0cJuoAiB4OOMV.Ug5vEUnNm666LX4FyE8JJ884CwC	Super	\N	2026-01-17 13:49:13.288484
\.


--
-- TOC entry 4964 (class 0 OID 24938)
-- Dependencies: 227
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventas (id, usuario_id, nombre_cliente, direccion, metodo_pago, total, fecha, estado) FROM stdin;
8	9	fdv	vdfv	Tarjeta	8000	2026-01-17 18:03:28.051906	En proceso
10	9	desfv	sdf	Transferencia	80000	2026-01-22 10:48:29.33826	Pagado
2	9	hoal	example	Transferencia	80000	2026-01-17 16:23:12.941936	Pendiente
5	9	ajaj	jaja	Tarjeta	90000	2026-01-17 16:27:38.4584	Pendiente
9	9	hjfr	fghf	Tarjeta	118000	2026-01-22 10:40:01.501929	Pendiente
3	9	ho	la	Tarjeta	24000	2026-01-17 16:24:16.604448	En proceso
7	9	dd	ddd	Tarjeta	190000	2026-01-17 16:38:59.832129	Entregado
4	9	ho	la	Tarjeta	24000	2026-01-17 16:25:14.561401	Entregado
6	9	Fidel	ddo	Transferencia	138000	2026-01-17 16:35:20.260939	Pagado
11	9	asa	asda	Efectivo	205000	2026-01-22 16:49:21.180172	Pendiente
\.


--
-- TOC entry 4966 (class 0 OID 24951)
-- Dependencies: 229
-- Data for Name: ventas_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventas_detalle (id, venta_id, item_id, cantidad, precio_unitario) FROM stdin;
1	2	PRD-ALMOHADA	4	20000
2	3	PRD-TOALLA-BANO	3	8000
3	4	PRD-TOALLA-BANO	3	8000
4	5	SVC-2D2B	2	45000
5	6	PRD-SABANAS-1P	1	18000
6	6	PRD-ALMOHADA	6	20000
7	7	PRD-ALMOHADA	1	20000
8	7	SVC-1D1B	2	35000
9	7	SVC-PROFUNDA	1	100000
10	8	PRD-TOALLA-MANO	2	4000
11	9	PRD-SABANAS-1P	5	18000
12	9	PRD-SABANAS-2P-PREMIUM	1	28000
13	10	PRD-ALMOHADA	4	20000
14	11	PRD-PLUMON-1P	2	30000
15	11	PRD-prueba	1	5000
16	11	SVC-2D1B	1	40000
17	11	SVC-PROFUNDA	1	100000
\.


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 224
-- Name: carrito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_id_seq', 43, true);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 219
-- Name: compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_id_seq', 1, false);


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 10, true);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 228
-- Name: ventas_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_detalle_id_seq', 17, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 226
-- Name: ventas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_id_seq', 11, true);


--
-- TOC entry 4797 (class 2606 OID 24929)
-- Name: carrito carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 24856)
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 24886)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 24920)
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 24936)
-- Name: carrito unique_usuario_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT unique_usuario_item UNIQUE (usuario_id, item_id);


--
-- TOC entry 4787 (class 2606 OID 24843)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4789 (class 2606 OID 24841)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 24956)
-- Name: ventas_detalle ventas_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas_detalle
    ADD CONSTRAINT ventas_detalle_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 24944)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 24930)
-- Name: carrito carrito_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4804 (class 2606 OID 24857)
-- Name: compras compras_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 24892)
-- Name: favoritos favoritos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4808 (class 2606 OID 24957)
-- Name: ventas_detalle ventas_detalle_venta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas_detalle
    ADD CONSTRAINT ventas_detalle_venta_id_fkey FOREIGN KEY (venta_id) REFERENCES public.ventas(id) ON DELETE CASCADE;


--
-- TOC entry 4807 (class 2606 OID 24945)
-- Name: ventas ventas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


-- Completed on 2026-01-27 16:56:14

--
-- PostgreSQL database dump complete
--

\unrestrict Pg7QwudHfmI1D4VSfrZBhurF0rcMG7hfSJLbyP14OM0LPYlbyDf2R4SjdldgZIt

