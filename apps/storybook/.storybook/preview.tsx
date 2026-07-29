import type { Preview } from '@storybook/react-vite';
import '@naon-timeline/ui/theme.css';
import 'leaflet/dist/leaflet.css';
import '../../dashboard/src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
