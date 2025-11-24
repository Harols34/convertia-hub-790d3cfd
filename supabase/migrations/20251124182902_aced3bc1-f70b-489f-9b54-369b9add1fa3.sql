-- Asignar rol de admin al usuario que no lo tiene
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'nuevpro2020@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id
);