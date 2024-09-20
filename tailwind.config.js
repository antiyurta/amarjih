const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'

  theme: {
    extend: {
      backgroundImage: theme => ({
        'login-image': "url('/assets/images/login.jpg')",
      }),
      backgroundColor: theme => ({
        ...theme('colors'),
        bg: '#F1F2F6',
        input: '#F6F6F6',
        yellow: '#DA7600',
        white: 'white',
        button: '#076FCA',
        disabled: '#EAEDF4',
        selected: '#0A3761',
        inactive: '#8AB1D5',
        menuButton: '#FFFFFF',
        grayButton: '#F7F7F7',
        background: '#1e63a3',
        buttonHover: 'rgba(0, 0, 0, 0.05)',
        success: '#8BC34A',
        cancel: '#8BC34A',
      }),
      theme: {
        screens: {
          tablet: '769px',
        },
        container: {
          center: true,
        },
      },
      borderColor: theme => ({
        ...theme('colors'),
        selected: '#177AD6',
        alert: '#F7B352',
        bg: '#F1F2F6',
        menuButton: 'rgba(0, 0, 0, 0.1)',
        grayButton: 'rgba(0, 0, 0, 0.05)',
        form: '#94aae7',
        link: '#1679D4',
        input: 'rgba(212, 212, 212, 1)',
      }),
      textColor: {
        primary: '#636363',
        secondary: '#0816b8',
        selected: '#177AD6',
        table: '#6A6A6A',
        gray: '#999999',
        subtitle: 'rgba(0, 0, 0, 0.6)',
        alert: '#F7B352',
        form: '#2982d4',
        link: '#1679D4',
        hover: '#829CB4',
        input: 'rgba(0, 0, 0, 0.4)',
        label: 'rgba(0, 0, 0, 0.4)',
        error: '#f84843',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
