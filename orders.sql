-- OverBerry — tabela de pedidos (MVP checkout Mercado Pago)
-- Rodar no SQL Editor do Supabase (uma vez).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  external_reference text unique not null,
  preference_id text,
  mercado_pago_payment_id text,
  status text not null default 'created',
  status_detail text,
  payment_method_id text,
  payment_type_id text,
  payer_email text,
  region text not null,
  subtotal numeric not null,
  shipping numeric not null,
  total numeric not null,
  items jsonb not null,
  raw_payment jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para o webhook localizar rápido pelo pagamento
create index if not exists orders_mp_payment_idx on public.orders (mercado_pago_payment_id);

-- Trigger de updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Segurança: RLS ligado, NENHUMA policy pública.
-- O servidor usa a service role key, que bypassa RLS.
-- Anon/authenticated não conseguem ler nem escrever nada.
alter table public.orders enable row level security;
