import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { TextField, Label, Input, FieldError } from 'react-aria-components';
import { Button, ThemeSelector } from '@naon-timeline/ui';
import logo from '../../logo-terracotta.svg';
import logoDark from '../../logo-terracotta-dark.svg';
import useLogin from '../../queries/useLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: ({ value }) => {
      loginMutation.mutate(value, {
        onSuccess: () => navigate({ to: '/' }),
      });
    },
  });

  return (
    <div className="relative flex h-dvh items-center justify-center bg-page font-sans text-ink">
      <ThemeSelector className="absolute right-5 top-5" />
      <div className="w-full max-w-[340px] rounded-[10px] border border-border bg-panel p-[26px]">
        <div className="mb-6 flex items-center gap-2.5">
          <img src={logo} alt="" className="logo-light h-7 w-7 flex-none rounded-[7px] object-cover" />
          <img src={logoDark} alt="" className="logo-dark h-7 w-7 flex-none rounded-[7px] object-cover" />
          <span className="text-sm font-bold tracking-tight">Naon Dashboard</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-3.5"
        >
          <form.Field
            name="email"
            validators={{ onChange: ({ value }) => (!value.trim() ? 'Email is required' : undefined) }}
          >
            {(field) => (
              <TextField
                type="email"
                isInvalid={field.state.meta.errors.length > 0}
                className="flex flex-col gap-1.5 text-xs text-muted"
              >
                <Label>Email</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="rounded-[7px] border border-border bg-input px-2.5 py-2.5 text-[13px] text-ink"
                />
                <FieldError className="text-[11px] text-danger">{field.state.meta.errors.join(', ')}</FieldError>
              </TextField>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: ({ value }) => (!value ? 'Password is required' : undefined) }}
          >
            {(field) => (
              <TextField
                type="password"
                isInvalid={field.state.meta.errors.length > 0}
                className="flex flex-col gap-1.5 text-xs text-muted"
              >
                <Label>Password</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="rounded-[7px] border border-border bg-input px-2.5 py-2.5 text-[13px] text-ink"
                />
                <FieldError className="text-[11px] text-danger">{field.state.meta.errors.join(', ')}</FieldError>
              </TextField>
            )}
          </form.Field>

          {loginMutation.isError && (
            <p className="text-[11px] text-danger">{loginMutation.error.message}</p>
          )}

          <Button type="submit" className="mt-1.5 w-full" isDisabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
