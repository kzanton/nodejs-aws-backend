
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text NULL,
	image text NULL,
	price integer NULL
);

CREATE TABLE IF NOT EXISTS public.stocks (
	product_id uuid NOT NULL,
	count integer NULL,
	unique (product_id),
	FOREIGN KEY (product_id) REFERENCES public.products(id)
);

INSERT INTO public.products (id, title, description, image, price) VALUES
(
	'a977c457-e0f8-4e8c-887a-ad74c362cd9d',
	'USS Enterprise NCC-1701-D',
    'The USS Enterprise (NCC-1701-D) was a 24th century Federation Galaxy-class starship operated by Starfleet, and the fifth Federation starship to bear the name Enterprise. During its career, the Enterprise served as the Federation flagship and was in service from 2363 to 2371.',
	'/assets/Eaglemoss_1_Enterprise-D.webp',
     100
),
(
	'5c7d6add-22af-43a5-898b-9938bc6ec2d2',
    'USS Voyager',
    'The USS Voyager (NCC-74656) was a 24th century Federation Intrepid-class starship operated by Starfleet. The vessel was famous for completing an unscheduled seven-year journey across the Delta Quadrant between 2371 and 2378, which was the first successful exploration of that quadrant by the Federation. It was the first ship to bear the name Voyager with this registry.',
    '/assets/Eaglemoss_6_USS_Voyager.webp',
     100
),
(
	'6dfb2fab-e60c-4efa-b9e0-f4049c2f4180',
    'USS Defiant NX-74205',
    'The USS Defiant (NX-74205) was a 24th century Federation Defiant-class starship operated by Starfleet. This was the prototype of the class and the second Federation ship known to bear the name Defiant.',
	'/assets/Eaglemoss_9_USS_Defiant.webp',
     100
),
(
	'ecf0c504-4604-4189-839d-8626f4987d4b',
	'Klingon Bird-of-Prey',
	'The Klingon Bird-of-Prey was a type of warship utilized by the Klingon Empire serving the Klingon Defense Forces from the late 23rd century into the late 24th century.',
    '/assets/Eaglemoss_3_Klingon_Bird_of_Prey.webp',
    100
),
(
	'd61215e1-fe7a-4415-95b6-46c575ceb0c7',
	'Romulan Warbird',
	E'The D\'deridex-class, alternately known as the B-type warbird, or warbird class starship, was one of the largest and most powerful mainstays of the Romulan Star Empire. It served as the backbone of the Romulan fleet during the later half of the 24th century.',
	'/assets/Eaglemoss_5_Romulan_Warbird.webp',
	100
),
(
	'1d6a0c14-3eb8-44fa-b3d1-39d6087cfeb6',
	'Borg sphere',
	'The Borg long-range tactical vessel, commonly referred to by the Federation as a Borg sphere, was a sphere-shaped starship used by the Borg Collective during the late 24th century.',
	'/assets/Eaglemoss_10_Borg_Sphere.webp',
	100
),
(
	'113272e9-673a-4cb9-a859-2503a098725f',
	'Cardassians Galor-Class',
	'Galor-class cruisers were the primary class of warship used by the Cardassian military during the latter half of the 24th century.',
	'/assets/Eaglemoss_14_Cardassian_Galor.webp',
	100
),
(
	'7de3a46e-11e0-4810-a299-5e09a2b2aa92',
	'Ferengi Marauder',
	E'The D\'Kora-class Marauder was a type of advanced starship utilized by the Ferengi Alliance during the 24th century. (TNG: "Force of Nature"; VOY: "Inside Man").',
	'/assets/Eaglemoss_16_Ferengi_Marauder.webp',
	100
)
ON CONFLICT DO NOTHING;

INSERT INTO public.stocks (product_id, count) VALUES
(
	'a977c457-e0f8-4e8c-887a-ad74c362cd9d',
	10
),
(
	'5c7d6add-22af-43a5-898b-9938bc6ec2d2',
	10
),
(
	'6dfb2fab-e60c-4efa-b9e0-f4049c2f4180',
	10
),
(
	'ecf0c504-4604-4189-839d-8626f4987d4b',
	10
),
(
	'd61215e1-fe7a-4415-95b6-46c575ceb0c7',
	10
),
(
	'1d6a0c14-3eb8-44fa-b3d1-39d6087cfeb6',
	10
),
(
	'113272e9-673a-4cb9-a859-2503a098725f',
	10
),
(
	'7de3a46e-11e0-4810-a299-5e09a2b2aa92',
	10
)
ON CONFLICT DO NOTHING;
