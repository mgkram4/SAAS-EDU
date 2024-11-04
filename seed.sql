DO $$ 
BEGIN
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 
  crypt('password123', gen_salt('bf')), now(), 
  '{"name":"Admin User"}'::jsonb);
END $$;
