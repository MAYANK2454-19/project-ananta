-- Give authorised organisers an account directory without exposing auth.users
-- directly through the public Data API.
create or replace function private.admin_list_accounts()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  invited_at timestamptz,
  account_type text,
  admin_role text,
  admin_active boolean,
  registration_status text,
  registration_source text,
  registration_date timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  if not coalesce(private.is_organiser(), false) then
    raise exception 'Only active organisers can view account status.'
      using errcode = '42501';
  end if;

  return query
    select
      u.id,
      lower(u.email)::text,
      u.created_at,
      u.email_confirmed_at,
      u.last_sign_in_at,
      u.invited_at,
      case when au.user_id is null then 'participant' else 'organiser' end::text,
      au.role::text,
      au.is_active,
      case when reg.registration_source is null then 'not_registered' else 'registered' end::text,
      reg.registration_source,
      reg.registration_date
    from auth.users as u
    left join public.admin_users as au on au.user_id = u.id
    left join lateral (
      select
        r.source as registration_source,
        coalesce(r.submitted_at, r.imported_at) as registration_date
      from public.registrations as r
      where
        r.user_id = u.id
        or (
          u.email is not null
          and lower(r.participant_email) = lower(u.email)
        )
      order by
        (r.user_id = u.id) desc,
        coalesce(r.submitted_at, r.imported_at) desc nulls last
      limit 1
    ) as reg on true
    where u.email is not null
    order by u.created_at desc;
end;
$function$;

revoke all on function private.admin_list_accounts() from public, anon;
grant execute on function private.admin_list_accounts() to authenticated, service_role;

create or replace function public.admin_list_accounts()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  invited_at timestamptz,
  account_type text,
  admin_role text,
  admin_active boolean,
  registration_status text,
  registration_source text,
  registration_date timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $function$
  select * from private.admin_list_accounts();
$function$;

revoke all on function public.admin_list_accounts() from public, anon;
grant execute on function public.admin_list_accounts() to authenticated, service_role;

comment on function public.admin_list_accounts() is
  'Lists account and registration status for active organisers only; never grants direct access to auth.users.';

