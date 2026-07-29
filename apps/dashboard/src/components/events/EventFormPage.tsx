import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { TextField, TextArea, Label, Input, FieldError, Checkbox, NumberField } from 'react-aria-components';
import useDashboard from '../../state/useDashboard';
import useIsMobile from '../layout/useIsMobile';
import Button from '../ui/Button';
import EventMapPicker from './EventMapPicker';
import { findAddress, MAP_CENTER } from '../../lib/geo';

type Props = { mode: 'create' } | { mode: 'edit'; eventId: string };

const EMPTY_FORM = {
  title: '',
  date: '',
  text: '',
  url: '',
  image: '',
  draft: false,
  lat: MAP_CENTER[0],
  lng: MAP_CENTER[1],
};

export default function EventFormPage(props: Props) {
  const { events, createEvent, updateEvent, openModal } = useDashboard();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [addressQuery, setAddressQuery] = useState('');
  const [addressNote, setAddressNote] = useState('');

  const editingEvent = props.mode === 'edit' ? events.find((e) => String(e.id) === props.eventId) : null;

  const form = useForm({
    defaultValues: editingEvent
      ? {
          title: editingEvent.title,
          date: editingEvent.date,
          text: editingEvent.text,
          url: editingEvent.url,
          image: editingEvent.image,
          draft: editingEvent.draft,
          lat: editingEvent.lat,
          lng: editingEvent.lng,
        }
      : EMPTY_FORM,
    onSubmit: ({ value }) => {
      if (props.mode === 'create') {
        createEvent(value);
      } else if (editingEvent) {
        updateEvent(editingEvent.id, value);
      }
      navigate({ to: '/events' });
    },
  });

  return (
    <div className="max-w-[960px] rounded-[10px] border border-border bg-panel p-[26px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className={`grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="flex flex-col gap-3.5">
            <form.Field
              name="title"
              validators={{ onChange: ({ value }) => (!value.trim() ? 'Title is required' : undefined) }}
            >
              {(field) => (
                <TextField
                  isInvalid={field.state.meta.errors.length > 0}
                  className="flex flex-col gap-1.5 text-xs text-muted"
                >
                  <Label>Title</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                  <FieldError className="text-[11px] text-danger">{field.state.meta.errors.join(', ')}</FieldError>
                </TextField>
              )}
            </form.Field>

            <form.Field
              name="date"
              validators={{ onChange: ({ value }) => (!value ? 'Date is required' : undefined) }}
            >
              {(field) => (
                <label className="flex flex-col gap-1.5 text-xs text-muted">
                  Date
                  <input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="text">
              {(field) => (
                <TextField className="flex flex-col gap-1.5 text-xs text-muted">
                  <Label>Text</Label>
                  <TextArea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[76px] resize-y rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                </TextField>
              )}
            </form.Field>

            <form.Field name="url">
              {(field) => (
                <TextField className="flex flex-col gap-1.5 text-xs text-muted">
                  <Label>Link URL (optional)</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                </TextField>
              )}
            </form.Field>

            <form.Field name="image">
              {(field) => (
                <TextField className="flex flex-col gap-1.5 text-xs text-muted">
                  <Label>Image URL (optional)</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                  />
                </TextField>
              )}
            </form.Field>

            <form.Field name="draft">
              {(field) => (
                <Checkbox
                  isSelected={field.state.value}
                  onChange={field.handleChange}
                  className="flex items-center gap-2 text-[13px]"
                >
                  {({ isSelected }) => (
                    <>
                      <span
                        className={`flex h-4 w-4 flex-none items-center justify-center rounded text-[11px] text-white ${
                          isSelected ? 'bg-accent' : 'border-[1.5px] border-border bg-white'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      Save as draft
                    </>
                  )}
                </Checkbox>
              )}
            </form.Field>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              <TextField value={addressQuery} onChange={setAddressQuery} className="flex-1">
                <Input
                  placeholder="Search address, e.g. Piazza Cavour"
                  className="w-full rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink"
                />
              </TextField>
              <Button
                variant="ghostSmall"
                onPress={() => {
                  const hit = findAddress(addressQuery);
                  if (hit) {
                    form.setFieldValue('lat', hit.lat);
                    form.setFieldValue('lng', hit.lng);
                    setAddressNote(`Jumped to ${hit.name}.`);
                  } else {
                    setAddressNote('Address not found — click the map to place the pin.');
                  }
                }}
              >
                Find
              </Button>
            </div>
            {addressNote && <div className="text-[11px] text-muted">{addressNote}</div>}

            <form.Subscribe selector={(state) => [state.values.lat, state.values.lng] as const}>
              {([lat, lng]) => (
                <EventMapPicker
                  lat={lat}
                  lng={lng}
                  onChange={(nextLat, nextLng) => {
                    form.setFieldValue('lat', nextLat);
                    form.setFieldValue('lng', nextLng);
                  }}
                />
              )}
            </form.Subscribe>

            <div className="flex gap-2">
              <form.Field name="lat">
                {(field) => (
                  <NumberField
                    value={field.state.value}
                    onChange={field.handleChange}
                    formatOptions={{ maximumFractionDigits: 6 }}
                    className="flex flex-1 flex-col gap-1.5 text-xs text-muted"
                  >
                    <Label>Lat</Label>
                    <Input className="w-full rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink" />
                  </NumberField>
                )}
              </form.Field>
              <form.Field name="lng">
                {(field) => (
                  <NumberField
                    value={field.state.value}
                    onChange={field.handleChange}
                    formatOptions={{ maximumFractionDigits: 6 }}
                    className="flex flex-1 flex-col gap-1.5 text-xs text-muted"
                  >
                    <Label>Lng</Label>
                    <Input className="w-full rounded-[7px] border border-border bg-white px-2.5 py-2.5 text-[13px] text-ink" />
                  </NumberField>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          {editingEvent && (
            <Button
              variant="danger"
              onPress={() =>
                openModal({
                  kind: 'confirmDelete',
                  target: 'event',
                  id: editingEvent.id,
                  label: `event "${editingEvent.title}"`,
                })
              }
            >
              Delete event
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onPress={() => navigate({ to: '/events' })}>
              Cancel
            </Button>
            <Button type="submit">{props.mode === 'create' ? 'Create event' : 'Save changes'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
